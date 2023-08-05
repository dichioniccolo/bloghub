"use client";

import { format } from "date-fns";
import { HelpCircle, InfinityIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { createCheckoutSession } from "~/app/_actions/stripe/create-checkout-session";
import type { GetProPlans } from "~/app/_api/stripe";
import type { GetUserPlan } from "~/app/_api/user";
import { Divider } from "~/app/_components/icons/divider";
import { AppRoutes } from "~/lib/common/routes";
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
      <CardContent className="grid grid-cols-1 divide-y divide-stone-200 px-0 dark:divide-stone-700 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="flex flex-col space-y-2 p-10">
          <div className="flex items-center">
            <h3>Total Post Visits</h3>
            <Tooltip>
              <TooltipContent>
                Number of billable post visits across all your projects
              </TooltipContent>
              <TooltipTrigger>
                <div className="flex h-4 w-8 justify-center">
                  <HelpCircle className="h-4 w-4 text-stone-500" />
                </div>
              </TooltipTrigger>
            </Tooltip>
          </div>
          <p className="text-sm text-stone-500">
            {formatNumber(userPlan.usage)} / {formatNumber(userPlan.plan.quota)}{" "}
            visits (
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
            <p className="text-2xl font-semibold text-stone-500">
              {formatNumber(projectsCount)}
            </p>
            <Divider className="h-8 w-8 text-stone-500" />
            <InfinityIcon className="h-8 w-8 text-stone-500" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-0">
        {!userPlan.plan.isPro ? (
          <UpgradePlanDialog proPlans={proPlans} />
        ) : (
          <div className="flex space-x-3">
            <Button onClick={onManageSubscription} disabled={isRunning}>
              {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
