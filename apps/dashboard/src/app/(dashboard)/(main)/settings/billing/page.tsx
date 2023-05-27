import { Suspense } from "react";
import { type Metadata } from "next";

import { Separator } from "@acme/ui";

import { PlanUsage, PlanUsageSkeleton } from "./_components/plan-usage";

export const metadata = {
  title: "Billing",
} satisfies Metadata;

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">
          Check your current plan and usage.
        </p>
      </div>
      <Separator />
      <Suspense fallback={<PlanUsageSkeleton />}>
        {/* @ts-expect-error react async component */}
        <PlanUsage />
      </Suspense>
    </div>
  );
}
