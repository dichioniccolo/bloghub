"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Slider } from "~/components/ui/slider";
import { Switch } from "~/components/ui/switch";
import { createCheckoutSession } from "~/app/_actions/stripe/create-checkout-session";
import type { GetProPlans } from "~/app/_api/stripe";
import { AppRoutes } from "~/lib/common/routes";
import { absoluteUrl } from "~/lib/url";
import { formatNumber } from "~/lib/utils";
import { useZact } from "~/lib/zact/client";

type Props = {
  proPlans: GetProPlans;
};

export function UpgradePlanDialog({ proPlans }: Props) {
  const [open, setOpen] = useState(false);

  const [tier, setTier] = useState(0);
  const [plan, setPlan] = useState(proPlans[tier]);
  const [annualBilling, setAnnualBilling] = useState(true);

  const period = annualBilling ? "yearly" : "monthly";

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

  const onUpgrade = () =>
    mutate({
      callbackUrl: absoluteUrl(AppRoutes.BillingSettings),
      name: plan?.name,
      period,
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
            <span className="text-sm text-stone-600 dark:text-stone-300">
              Billed Monthly
            </span>
            <Switch
              checked={annualBilling}
              onCheckedChange={setAnnualBilling}
            />
            <span className="text-sm text-stone-600 dark:text-stone-300">
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
              <p className="text-2xl font-semibold text-stone-700 dark:text-stone-300">
                €{plan?.prices[period]?.unit_amount ?? ""}
              </p>
              <p className="text-sm text-stone-700 dark:text-stone-300">
                /{annualBilling ? "yr" : "mo"}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center space-y-1 p-5 text-center">
            {proPlans.length > 1 && (
              <Slider
                onValueChange={(value) => setTier(value[0] ?? 0)}
                value={[tier]}
                min={0}
                max={proPlans.length - 1}
              />
            )}
            <p className="text-sm text-stone-700 dark:text-stone-300">
              Up to {formatNumber(plan?.quota ?? 0)} post visits/mo
            </p>
          </div>
        </div>
        <Button disabled={isRunning} onClick={onUpgrade}>
          {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upgrade to {plan?.name}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
