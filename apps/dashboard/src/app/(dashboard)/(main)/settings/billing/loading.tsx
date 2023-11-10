import { Separator } from "@acme/ui/components/separator";

import { PlanUsageSkeleton } from "./_components/plan-usage";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Billing</h2>
        <p className="text-sm text-muted-foreground">
          Check your current plan and usage.
        </p>
      </div>
      <Separator />
      <PlanUsageSkeleton />
    </div>
  );
}
