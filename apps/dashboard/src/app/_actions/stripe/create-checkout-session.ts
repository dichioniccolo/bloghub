"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@acme/db";
import { stripe } from "@acme/stripe";
import {
  isSubscriptionPlanPro,
  planKeyToPlanInfo,
  stripePriceToSubscriptionPlan,
} from "@acme/stripe/plans";

import { authenticatedAction } from "../authenticated-action";

export const createCheckoutSession = authenticatedAction(() =>
  z.object({
    callbackUrl: z.string().min(1),
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
  const dbUser = await db.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      stripePriceId: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      email: true,
    },
  });

  const currentUserPlan = stripePriceToSubscriptionPlan(dbUser.stripePriceId);

  if (
    isSubscriptionPlanPro(currentUserPlan) &&
    dbUser.stripeCustomerId &&
    dbUser.stripeSubscriptionId
  ) {
    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: callbackUrl,
    });

    redirect(stripeSession.url);
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
    payment_method_types: ["card", "paypal", "revolut_pay"],
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

  redirect(stripeSession.url!);
});
