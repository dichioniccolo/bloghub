"use server";

import { z } from "zod";

import { stripe } from "@acme/common/external/stripe";
import { determinePlanPriceId } from "@acme/common/external/stripe/actions";
import { db, eq, users } from "@acme/db";
import { zact } from "@acme/zact/server";

export const createCheckoutSession = zact(
  z.object({
    userId: z.string().nonempty(),
    callbackUrl: z.string().nonempty(),
    name: z.string().nullable().optional(),
    period: z.enum(["monthly", "yearly"]).nullable().optional(),
  }),
)(async ({ userId, callbackUrl, period, name }) => {
  const dbUser = await db
    .select({
      stripeCustomerId: users.stripeCustomerId,
      stripeSubscriptionId: users.stripeSubscriptionId,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, userId))
    .then((x) => x[0]);

  if (!dbUser) {
    return;
  }

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
