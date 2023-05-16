"use server";

import { z } from "zod";

import { prisma } from "@acme/db";
import { stripe } from "@acme/stripe";
import { determinePlanPriceId } from "@acme/stripe/actions";

import { zact } from "~/lib/zact/server";

export const createCheckoutSession = zact(
  z.object({
    userId: z.string(),
    callbackUrl: z.string(),
    name: z.string().nullable().optional(),
    period: z.enum(["monthly", "yearly"]).nullable().optional(),
  }),
)(async ({ userId, callbackUrl, period, name }) => {
  const dbUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCustomerId: true,
      email: true,
    },
  });

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
    customer_email: dbUser.email?.toString(),
    tax_id_collection: {
      enabled: true,
    },
    client_reference_id: userId,
  });

  return stripeSession.url;
});
