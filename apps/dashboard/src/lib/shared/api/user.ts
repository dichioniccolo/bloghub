"use server";

import { prisma } from "@acme/db";
import { type SubscriptionPlan } from "@acme/stripe";
import { determinePlanByPriceId } from "@acme/stripe/actions";

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
      usage: true,
      dayWhenbillingStarts: true,
    },
  });

  const plan = await determinePlanByPriceId(dbUser?.stripePriceId);

  return {
    plan,
    usage: dbUser?.usage ?? 0,
  };
}

export type GetUserPlan = Awaited<ReturnType<typeof getUserPlan>>;
