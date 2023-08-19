import { Suspense } from "react";
import type { Metadata } from "next";

import { Separator } from "~/components/ui/separator";
import { PlanUsage, PlanUsageSkeleton } from "./_components/plan-usage";

export const metadata = {
  title: "Billing",
} satisfies Metadata;

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Billing</h2>
        <p className="text-sm text-muted-foreground">
          Check your current plan and usage.
        </p>
      </div>
      <Separator />
      <Suspense fallback={<PlanUsageSkeleton />}>
        <PlanUsage />
      </Suspense>
    </div>
  );
}
