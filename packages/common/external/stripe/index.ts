import Stripe from "stripe";

import { env } from "../../env.mjs";

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
    "The free plan is limited in clicks you can get per month. Upgrade to the PRO plan for unlimited clicks.",
  quota: 1000,
  isPro: false,
} satisfies SubscriptionPlan;

export const pro10KPlan = {
  name: "Pro 10K",
  description: "The PRO 10K plan has 10,000 clicks.",
  prices: {
    monthly: env.STRIPE_PRO_10K_MONTHLY_PLAN_ID,
    yearly: env.STRIPE_PRO_10K_YEARLY_PLAN_ID,
  },
  quota: 10000,
  isPro: true,
} satisfies SubscriptionPlan;

export const proUnlimitedPlan = {
  name: "Pro Unlimited",
  description: "The PRO Unlimited plan has unlimited clicks.",
  prices: {
    monthly: env.STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID,
    yearly: env.STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID,
  },
  quota: Number.MAX_SAFE_INTEGER,
  isUnlimited: true,
  isPro: true,
} satisfies SubscriptionPlan;

export const proPlans = [pro10KPlan, proUnlimitedPlan];
