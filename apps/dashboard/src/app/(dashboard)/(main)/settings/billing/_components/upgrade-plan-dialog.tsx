"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AppRoutes } from "@acme/lib/routes";
import { absoluteUrl } from "@acme/lib/url";
import { formatNumber } from "@acme/lib/utils";
import { useServerAction } from "@acme/server-actions/client";
import { PLANS } from "@acme/stripe/plans";
import { Button } from "@acme/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/components/ui/dialog";
import { Slider } from "@acme/ui/components/ui/slider";
import { Switch } from "@acme/ui/components/ui/switch";

import { createCheckoutSession } from "~/app/_actions/stripe/create-checkout-session";
import type { GetProPlans } from "~/app/_api/stripe";
import { SubmitButton } from "~/components/submit-button";

interface Props {
  proPlans: GetProPlans;
}

export function UpgradePlanDialog({ proPlans }: Props) {
  const [open, setOpen] = useState(false);

  const [tier, setTier] = useState(0);
  const [plan, setPlan] = useState(PLANS.PRO_UNLIMITED_M);
  const [annualBilling, setAnnualBilling] = useState(false);

  const monthlyPlans = useMemo(
    () => [PLANS.PRO_50K_M, PLANS.PRO_UNLIMITED_M],
    [],
  );

  const yearlyPlans = useMemo(
    () => [PLANS.PRO_50K_Y, PLANS.PRO_UNLIMITED_Y],
    [],
  );

  const period = annualBilling ? "yearly" : "monthly";

  const { action } = useServerAction(createCheckoutSession, {
    onServerError: (error) => {
      error && toast.error(error);
    },
  });

  const onUpgrade = () =>
    action({
      callbackUrl: absoluteUrl(AppRoutes.BillingSettings),
      key: plan.key,
    });

  useEffect(() => {
    if (period === "monthly") {
      setPlan(monthlyPlans[tier]!);
    } else if (period === "yearly") {
      setPlan(yearlyPlans[tier]!);
    }
  }, [tier, plan, period, monthlyPlans, yearlyPlans]);

  const selectedPlan = useMemo(() => {
    return proPlans.find((p) => p.key === plan.key);
  }, [plan.key, proPlans]);

  useEffect(() => {
    if (!selectedPlan) {
      setPlan(PLANS.PRO_UNLIMITED_M);
      setAnnualBilling(false);
    }
  }, [selectedPlan]);

  if (!selectedPlan) {
    return null;
  }

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
              {selectedPlan.name}
            </h3>
            <div className="flex items-center">
              <p className="text-2xl font-semibold text-stone-700 dark:text-stone-300">
                €{selectedPlan.price ?? ""}
              </p>
              <p className="text-sm text-stone-700 dark:text-stone-300">
                /{annualBilling ? "yr" : "mo"}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center space-y-1 p-5 text-center">
            <Slider
              onValueChange={(value) => setTier(value[0] ?? 0)}
              value={[tier]}
              min={0}
              max={monthlyPlans.length - 1}
            />
            <p className="text-sm text-stone-700 dark:text-stone-300">
              Up to {formatNumber(selectedPlan.quota ?? 0)} post visits/mo
            </p>
          </div>
        </div>
        <form action={onUpgrade}>
          <SubmitButton>Upgrade to {selectedPlan.name}</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
