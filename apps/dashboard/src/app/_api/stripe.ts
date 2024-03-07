"use server";

import { stripe } from "@acme/stripe";
import { PLANS } from "@acme/stripe/plans";

export const getProPlans = async () => {
  const [
    pro50KMonthlyPrice,
    pro50KYearlyPrice,
    proUnlimitedMonthlyPrice,
    proUnlimitedYearlyPrice,
  ] = await Promise.all([
    stripe.prices.retrieve(PLANS.PRO_50K_M.priceId),
    stripe.prices.retrieve(PLANS.PRO_50K_Y.priceId),
    stripe.prices.retrieve(PLANS.PRO_UNLIMITED_M.priceId),
    stripe.prices.retrieve(PLANS.PRO_UNLIMITED_Y.priceId),
  ]);

  return [
    {
      ...PLANS.PRO_50K_M,
      price: pro50KMonthlyPrice.unit_amount! / 100,
    },
    {
      ...PLANS.PRO_50K_Y,
      price: pro50KYearlyPrice.unit_amount! / 100,
    },
    {
      ...PLANS.PRO_UNLIMITED_M,
      price: proUnlimitedMonthlyPrice.unit_amount! / 100,
    },
    {
      ...PLANS.PRO_UNLIMITED_Y,
      price: proUnlimitedYearlyPrice.unit_amount! / 100,
    },
  ];
};

export type GetProPlans = Awaited<ReturnType<typeof getProPlans>>;
