"use server";

import { env } from "~/env.mjs";
import { freePlan, proPlans, proUnlimitedPlan, stripe } from ".";

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
export async function determinePlanByPriceId(
  email: string,
  priceId?: string | null,
) {
  if (email === env.ADMIN_EMAIL) {
    return proUnlimitedPlan;
  }

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
