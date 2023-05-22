"use server";

import { getUserTotalUsage } from "@acme/common/actions";
import { type SubscriptionPlan } from "@acme/common/external/stripe";
import { determinePlanByPriceId } from "@acme/common/external/stripe/actions";
import { prisma } from "@acme/db";

import { $getUser } from "../get-user";

export async function getUserPlan(): Promise<{
  plan: SubscriptionPlan;
  usage: number;
}> {
  const user = await $getUser();

  const dbUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      stripeSubscriptionId: true,
      stripePriceId: true,
      dayWhenbillingStarts: true,
    },
  });

  const usage = await getUserTotalUsage(user.id);

  const plan = await determinePlanByPriceId(dbUser?.stripePriceId);

  return {
    plan,
    usage,
  };
}

export type GetUserPlan = Awaited<ReturnType<typeof getUserPlan>>;
