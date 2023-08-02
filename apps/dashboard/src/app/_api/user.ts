"use server";

import { db, eq, users } from "@bloghub/db";

import { getUserTotalUsage } from "~/lib/common/actions";
import { determinePlanByPriceId } from "~/lib/common/external/stripe/actions";
import { $getUser } from "./get-user";

export async function getUserPlan() {
  const user = await $getUser();

  const dbUser = await db
    .select({
      email: users.email,
      stripeSubscriptionId: users.stripeSubscriptionId,
      stripePriceId: users.stripePriceId,
      dayWhenBillingStarts: users.dayWhenBillingStarts,
    })
    .from(users)
    .where(eq(users.id, user.id))
    .then((x) => x[0]!);

  const billingPeriod = await getBillingPeriod(dbUser.dayWhenBillingStarts);

  const usage = await getUserTotalUsage(
    user.id,
    billingPeriod[0],
    billingPeriod[1],
  );

  const plan = await determinePlanByPriceId(dbUser.email, dbUser.stripePriceId);

  return {
    plan,
    usage,
    billingPeriod,
  };
}

export type GetUserPlan = Awaited<ReturnType<typeof getUserPlan>>;

// eslint-disable-next-line @typescript-eslint/require-await
export async function getBillingPeriod(dayWhenBillingStarts: Date) {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const day = dayWhenBillingStarts.getDate();

  if (currentDay >= day) {
    return [
      new Date(currentYear, currentMonth, day),
      new Date(currentYear, currentMonth + 1, day - 1),
    ] as const;
  }

  const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear; // if the current month is January, we need to go back a year
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // if the current month is January, we need to go back to December

  return [
    new Date(lastYear, lastMonth, day),
    new Date(currentYear, currentMonth, day - 1),
  ] as const;
}
