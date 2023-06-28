"use server";

import { z } from "zod";

import { db, eq, users } from "@bloghub/db";

import { $getUser } from "~/app/_api/get-user";
import { stripe } from "~/lib/common/external/stripe";
import { determinePlanPriceId } from "~/lib/common/external/stripe/actions";
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
      name: z.string().nullable().optional(),
      period: z.enum(["monthly", "yearly"]).nullable().optional(),
    }),
)(async ({ callbackUrl, period, name }, { userId }) => {
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

  if (!name || !period) {
    throw new Error("Unable to determine chosen plan");
  }

  const priceId = await determinePlanPriceId(name, period);

  if (!priceId) {
    throw new Error("Unable to determine chosen plan");
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: callbackUrl,
    cancel_url: callbackUrl,
    billing_address_collection: "required",
    customer_email: dbUser.email,
    tax_id_collection: {
      enabled: true,
    },
    client_reference_id: userId,
    customer: dbUser.stripeCustomerId ?? undefined,
  });

  return stripeSession.url;
});
