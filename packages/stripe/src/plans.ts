import { env } from "./env.mjs";

export type PlanInfo = {
  name: string;
  description: string;
  features: string[];
  quota: number;
  color: string;
} & (
  | {
      key: "PRO_50K_M";
      priceId: string;
    }
  | {
      key: "PRO_50K_Y";
      priceId: string;
    }
  | {
      key: "PRO_UNLIMITED_M";
      priceId: string;
    }
  | {
      key: "PRO_UNLIMITED_Y";
      priceId: string;
    }
  | {
      key: "FREE";
      priceId: string;
    }
);

export type PlanInfoKeys = Uppercase<PlanInfo["key"]>;

export const PLANS: Record<PlanInfoKeys, PlanInfo> = {
  FREE: {
    key: "FREE",
    name: "Free",
    description: "Free plan",
    features: [],
    priceId: "no-id-needed",
    quota: 10000,
    color: "#000000",
  },
  PRO_50K_M: {
    key: "PRO_50K_M",
    name: "Pro 50k",
    description: "Pro 50k Monthly",
    features: [],
    priceId: env.STRIPE_PRO_50K_MONTHLY_PLAN_ID,
    quota: 50000,
    color: "#ff0000",
  },
  PRO_50K_Y: {
    key: "PRO_50K_Y",
    name: "Pro 50k",
    description: "Pro 50k Yearly",
    features: [],
    priceId: env.STRIPE_PRO_50K_YEARLY_PLAN_ID,
    quota: 50000,
    color: "#ff0000",
  },
  PRO_UNLIMITED_M: {
    key: "PRO_UNLIMITED_M",
    name: "Pro Unlimited",
    description: "Pro Unlimited Monthly",
    features: [],
    priceId: env.STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID,
    quota: Number.MAX_SAFE_INTEGER,
    color: "#ff0000",
  },
  PRO_UNLIMITED_Y: {
    key: "PRO_UNLIMITED_Y",
    name: "Pro Unlimited",
    description: "Pro Unlimited Yearly",
    features: [],
    priceId: env.STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID,
    quota: Number.MAX_SAFE_INTEGER,
    color: "#ff0000",
  },
};

export function stripePriceToSubscriptionPlan(priceId?: string | null) {
  return (
    Object.values(PLANS).find((plan) => plan.priceId === priceId) ?? PLANS.FREE
  );
}

export function planKeyToPlanInfo(key: PlanInfoKeys) {
  return PLANS[key];
}

export function isSubscriptionPlanPro(plan: PlanInfo) {
  return plan.key !== "FREE";
}
