"use server";

import { freePlan, proPlans, stripe } from "../stripe";

export async function getUserSubscription(subscriptionId?: string | null) {
  if (!subscriptionId) {
    return null;
  }

  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function isUserPro(
  subscriptionId?: string | null,
): Promise<boolean> {
  const subscription = await getUserSubscription(subscriptionId);

  return (
    subscription?.status === "active" || subscription?.status === "trialing"
  );
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function determinePlan(name: string) {
  return proPlans.find((plan) => plan.name === name);
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function determinePlanByPriceId(priceId?: string | null) {
  if (!priceId) {
    return freePlan;
  }

  return (
    proPlans.find(
      (plan) =>
        plan.prices?.monthly === priceId || plan.prices?.yearly === priceId,
    ) ?? freePlan
  );
}

export async function determinePlanPriceId(
  name: string,
  period: "monthly" | "yearly",
) {
  return (await determinePlan(name))?.prices[period];
}
