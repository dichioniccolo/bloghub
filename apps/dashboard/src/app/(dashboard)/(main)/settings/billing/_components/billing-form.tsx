"use client";

import { format } from "date-fns";
import { toast } from "sonner";

import { AppRoutes } from "@acme/common/routes";
import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Progress } from "@acme/ui/components/progress";
import { Separator } from "@acme/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui/components/tooltip";
import { useZact } from "@acme/zact/client";

import { createCheckoutSession } from "~/app/_actions/stripe/create-checkout-session";
import { type GetProPlans } from "~/app/_api/stripe";
import { type GetUserPlan } from "~/app/_api/user";
import { Icons } from "~/app/_components/icons";
import { absoluteUrl } from "~/lib/url";
import { formatNumber } from "~/lib/utils";
import { UpgradePlanDialog } from "./upgrade-plan-dialog";

type Props = {
  userPlan: GetUserPlan;
  projectsCount: number;
  proPlans: GetProPlans;
};

export function BillingForm({ userPlan, projectsCount, proPlans }: Props) {
  const { mutate, isRunning } = useZact(createCheckoutSession, {
    onSuccess: (url) => {
      if (!url) {
        toast.error("Something went wrong");
        return;
      }

      // Redirect to the Stripe session.
      // This could be a checkout page for initial upgrade.
      // Or portal to manage existing subscription.
      location.href = url;
    },
    onServerError: () => {
      toast.error("Something went wrong");
    },
    onValidationError: () => {
      toast.error("Something went wrong");
    },
  });

  const onManageSubscription = () =>
    mutate({
      callbackUrl: absoluteUrl(AppRoutes.BillingSettings),
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
          plan. Current billing cycle:{" "}
          <span className="font-medium">
            {format(userPlan.billingPeriod[0], "MMM dd")} -{" "}
            {format(userPlan.billingPeriod[1], "MMM dd")}
          </span>
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
          <div className="h-3 w-full overflow-hidden rounded-full">
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
            <Button onClick={onManageSubscription} disabled={isRunning}>
              {isRunning && (
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
  return <div>loading</div>;
}
