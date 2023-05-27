"use client";

import { useTransition } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { createCheckoutSession } from "~/lib/shared/actions/create-checkout-session";
import { type GetProPlans } from "~/lib/shared/api/stripe";
import { type GetUserPlan } from "~/lib/shared/api/user";
import { absoluteUrl } from "~/lib/url";
import { formatNumber } from "~/lib/utils";
import { useZact } from "~/lib/zact/client";
import { UpgradePlanDialog } from "./upgrade-plan-dialog";

type Props = {
  userPlan: GetUserPlan;
  projectsCount: number;
  proPlans: GetProPlans;
};

export function BillingForm({ userPlan, projectsCount, proPlans }: Props) {
  const user = useUser();

  const { toast } = useToast();

  const [loading, startTransition] = useTransition();
  const { mutate } = useZact(createCheckoutSession);

  const onManageSubscription = () =>
    startTransition(async () => {
      const url = await mutate({
        userId: user.id,
        callbackUrl: absoluteUrl("/settings/billing"),
      });

      if (!url) {
        toast({
          title: "Something went wrong.",
          variant: "destructive",
        });
        return;
      }

      // Redirect to the Stripe session.
      // This could be a checkout page for initial upgrade.
      // Or portal to manage existing subscription.
      location.href = url;
    });

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Plan & Usage</CardTitle>
        <CardDescription>
          You are currently on the{" "}
          <Badge variant={userPlan.plan.isPro ? "destructive" : "default"}>
            {userPlan.plan.name}
          </Badge>{" "}
          plan.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-1 divide-y divide-gray-200 px-0 dark:divide-gray-700 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="flex flex-col space-y-2 p-10">
          <div className="flex items-center">
            <h3>Total Post Clicks</h3>
            <Tooltip>
              <TooltipContent>
                Number of billable post clicks across all your projects
              </TooltipContent>
              <TooltipTrigger>
                <div className="flex h-4 w-8 justify-center">
                  <Icons.helpCircle className="h-4 w-4 text-gray-500" />
                </div>
              </TooltipTrigger>
            </Tooltip>
          </div>
          <p className="text-sm text-gray-500">
            {formatNumber(userPlan.usage)} / {formatNumber(userPlan.plan.quota)}{" "}
            clicks (
            {((userPlan.usage / (userPlan.plan.quota ?? 0)) * 100).toFixed(1)}
            %)
          </p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
            <Progress
              value={(userPlan.usage / (userPlan.plan.quota ?? 0)) * 100}
            />
          </div>
        </div>
        <div className="p-10">
          <h3 className="font-medium">Number of Projects</h3>
          <div className="mt-4 flex items-center">
            <p className="text-2xl font-semibold text-black dark:text-gray-50">
              {formatNumber(projectsCount)}
            </p>
            <Icons.divider className="h-8 w-8 text-gray-500" />
            <Icons.infinite className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-0">
        {!userPlan.plan.isPro ? (
          <UpgradePlanDialog proPlans={proPlans} />
        ) : (
          <div className="flex space-x-3">
            <Button onClick={onManageSubscription} disabled={loading}>
              {loading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Manage Subscription
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export function BillingFormSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col space-y-3 p-10">
        <h2 className="text-xl font-medium">Plan &amp; Usage</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          You are currently on the <Badge /> plan.
        </p>
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700" />
      <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="flex flex-col space-y-2 p-10">
          <div className="flex items-center">
            <h3>Total Post Clicks</h3>
            <Tooltip>
              <TooltipContent>
                Number of billable post clicks across all your projects
              </TooltipContent>
              <TooltipTrigger>
                <div className="flex h-4 w-8 justify-center">
                  <Icons.helpCircle className="h-4 w-4 text-gray-500" />
                </div>
              </TooltipTrigger>
            </Tooltip>
          </div>
          <p className="text-sm text-gray-500">... / ... clicks (...%)</p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
            <div className="h-3 rounded-full" />
          </div>
        </div>
        <div className="p-10">
          <h3 className="font-medium">Number of Projects</h3>
          <div className="mt-4 flex items-center">
            <p className="text-2xl font-semibold text-black dark:text-gray-50">
              ...
            </p>
            <Icons.divider className="h-8 w-8 text-gray-500" />
            <Icons.infinite className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700"></div>
      <div className="flex flex-col items-center justify-between space-y-3 px-10 py-4 text-center sm:flex-row sm:space-y-0 sm:text-left">
        <div className="flex space-x-3">
          <Button className="w-16 animate-pulse" disabled></Button>
        </div>
      </div>
    </div>
  );
}
