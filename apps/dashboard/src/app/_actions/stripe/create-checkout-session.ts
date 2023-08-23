"use server";

import { z } from "zod";

import { db, eq, users } from "@acme/db";
import { stripe } from "@acme/stripe";
import { isSubscriptionPlanPro, planKeyToPlanInfo } from "@acme/stripe/plans";

import { $getUser } from "~/app/_api/get-user";
import { zactAuthenticated } from "~/lib/zact/server";

export const createCheckoutSession = zactAuthenticated(
  async () => {
    const user = await $getUser();

    return {
      userId: user.id,
    };
  },
  () =>
    z.object({
      callbackUrl: z.string().nonempty(),
      key: z
        .enum([
          "FREE", // we put FREE for type definitions, but we won't allow it in the code
          "PRO_50K_M",
          "PRO_50K_Y",
          "PRO_UNLIMITED_M",
          "PRO_UNLIMITED_Y",
        ]) // check the type PlanInfoKeys
        .optional()
        .nullable()
        .transform((x) => x?.toUpperCase()),
    }),
)(async ({ callbackUrl, key }, { userId }) => {
  const dbUser = await db
    .select({
      stripeCustomerId: users.stripeCustomerId,
      stripeSubscriptionId: users.stripeSubscriptionId,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, userId))
    .then((x) => x[0]!);

  if (dbUser.stripeCustomerId && dbUser.stripeSubscriptionId) {
    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: callbackUrl,
    });

    return stripeSession.url;
  }

  if (!key) {
    throw new Error("You must provide a plan key");
  }

  const plan = planKeyToPlanInfo(key);

  if (!isSubscriptionPlanPro(plan)) {
    throw new Error("You cannot chose free plan");
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: dbUser.stripeCustomerId ?? undefined,
    customer_email: dbUser.email,
    client_reference_id: userId,
    success_url: callbackUrl,
    cancel_url: callbackUrl,
    billing_address_collection: "required",
    tax_id_collection: {
      enabled: true,
    },
    allow_promotion_codes: true,
    subscription_data: {
      metadata: {
        userId,
      },
    },
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
  });

  return stripeSession.url;
});
