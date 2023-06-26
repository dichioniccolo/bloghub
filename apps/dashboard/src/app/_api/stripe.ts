"use server";

import { proPlans, stripe } from "@bloghub/common/external/stripe";

export async function getProPlans() {
  const allPrices = [
    ...proPlans.map((x) => x.prices.monthly),
    ...proPlans.map((x) => x.prices.yearly),
  ];

  const prices = await Promise.all(
    allPrices.map((p) => stripe.prices.retrieve(p)),
  );

  const plans = proPlans.map((plan) => {
    const monthly = prices.find((p) => p.id === plan.prices.monthly);
    const yearly = prices.find((p) => p.id === plan.prices.yearly);

    return {
      ...plan,
      prices: {
        monthly: {
          unit_amount: (monthly?.unit_amount ?? 0) / 100,
        },
        yearly: {
          unit_amount: (yearly?.unit_amount ?? 0) / 100,
        },
      },
    };
  });

  return plans;
}

export type GetProPlans = Awaited<ReturnType<typeof getProPlans>>;
