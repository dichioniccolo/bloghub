import Stripe from "stripe";

import { env } from "~/env.mjs";

export { Stripe };

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export type SubscriptionPlan = {
  name: string;
  description: string;
  isPro: boolean;
  quota: number;
  isUnlimited?: true;
} & (
  | {
      prices: {
        monthly: string;
        yearly: string;
      };
    }
  | {
      prices?: never;
    }
);

export const freePlan = {
  name: "Free",
  description:
    "The free plan is limited in visits you can get per month. Upgrade to one of the PRO plans to increase your limits.",
  quota: 10000,
  isPro: false,
} satisfies SubscriptionPlan;

export const pro50KPlan = {
  name: "Pro 50K",
  description: "The PRO 50K plan has 50,000 visits.",
  prices: {
    monthly: env.STRIPE_PRO_50K_MONTHLY_PLAN_ID,
    yearly: env.STRIPE_PRO_50K_YEARLY_PLAN_ID,
  },
  quota: 50000,
  isPro: true,
} satisfies SubscriptionPlan;

export const proUnlimitedPlan = {
  name: "Pro Unlimited",
  description: "The PRO Unlimited plan has unlimited visits.",
  prices: {
    monthly: env.STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID,
    yearly: env.STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID,
  },
  quota: Number.MAX_SAFE_INTEGER,
  isUnlimited: true,
  isPro: true,
} satisfies SubscriptionPlan;

export const proPlans = [pro50KPlan, proUnlimitedPlan];
