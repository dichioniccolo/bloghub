import { Suspense } from "react";
import { type Metadata } from "next";

import { DashboardHeader } from "~/app/_components/dashboard-header";
import { DashboardShell } from "~/app/_components/dashboard-shell";
import { PlanUsage, PlanUsageSkeleton } from "../_components/plan-usage";
import { UserNameForm } from "../_components/user-form";

export const metadata = {
  title: "Settings",
} satisfies Metadata;

export default function AppDashboardMainSettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" />
      <UserNameForm />
      <Suspense fallback={<PlanUsageSkeleton />}>
        {/* @ts-expect-error react async component */}
        <PlanUsage />
      </Suspense>
    </DashboardShell>
  );
}
