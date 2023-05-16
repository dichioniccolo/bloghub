"use client";

import { useEffect, useState, useTransition } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Slider,
  Switch,
  useToast,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { createCheckoutSession } from "~/lib/shared/actions/create-checkout-session";
import { type GetProPlans } from "~/lib/shared/api/stripe";
import { absoluteUrl } from "~/lib/url";
import { formatNumber } from "~/lib/utils";
import { useZact } from "~/lib/zact/client";

type Props = {
  proPlans: GetProPlans;
};

export function UpgradePlanDialog({ proPlans }: Props) {
  const user = useUser();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [tier, setTier] = useState(0);
  const [plan, setPlan] = useState(proPlans[tier]);
  const [annualBilling, setAnnualBilling] = useState(true);

  const period = annualBilling ? "yearly" : "monthly";

  const [loading, startTransition] = useTransition();
  const { mutate } = useZact(createCheckoutSession);

  const onUpgrade = () =>
    startTransition(() => {
      mutate({
        userId: user.id,
        callbackUrl: absoluteUrl("/settings"),
        name: plan?.name,
        period,
      })
        .then((url) => {
          if (!url) {
            return toast({
              title: "Something went wrong.",
              description: "Please refresh the page and try again.",
              variant: "destructive",
            });
          }

          // Redirect to the Stripe session.
          // This could be a checkout page for initial upgrade.
          // Or portal to manage existing subscription.
          location.href = url;
        })
        .catch((_) => {
          //
        });
    });

  useEffect(() => {
    if (proPlans.length > tier) {
      setPlan(proPlans[proPlans.length - 1]);
    } else if (tier < 0) {
      setPlan(proPlans[0]);
    }

    setPlan(proPlans[tier]);
  }, [tier, plan, proPlans]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upgrade</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span>Upgrade to Pro</span>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Billed Monthly
            </span>
            <Switch
              checked={annualBilling}
              onCheckedChange={setAnnualBilling}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Billed Annually
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          {annualBilling && (
            <span className="absolute -right-0.5 top-2 rounded-l-md bg-gradient-to-r from-blue-600 to-cyan-600 px-2 py-0.5 text-xs text-white">
              2 Free Months
            </span>
          )}
          <div className="flex w-full items-center justify-between p-5 pt-7">
            <h3 className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-2xl text-transparent">
              {plan?.name}
            </h3>
            <div className="flex items-center">
              <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                €{plan?.prices[period]?.unit_amount ?? ""}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                /{annualBilling ? "yr" : "mo"}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center space-y-1 rounded-b-lg border-t border-gray-200 bg-gray-50 p-5 text-center dark:border-gray-800 dark:bg-gray-800">
            {proPlans.length > 1 && (
              <Slider
                onValueChange={(value) => setTier(value[0] ?? 0)}
                value={[tier]}
                min={0}
                max={proPlans.length - 1}
              />
            )}
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Up to {formatNumber(plan?.quota ?? 0)} post clicks/mo
            </p>
          </div>
        </div>
        <Button disabled={loading} onClick={onUpgrade}>
          {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Upgrade to {plan?.name}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
