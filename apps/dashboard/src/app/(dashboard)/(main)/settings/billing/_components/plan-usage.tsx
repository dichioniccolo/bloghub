import { getProjectsCount } from "~/lib/shared/api/projects";
import { getProPlans } from "~/lib/shared/api/stripe";
import { getUserPlan } from "~/lib/shared/api/user";
import { BillingForm, BillingFormSkeleton } from "./billing-form";

export async function PlanUsage() {
  const [projectsCount, userPlan, proPlans] = await Promise.all([
    getProjectsCount(),
    getUserPlan(),
    getProPlans(),
  ]);

  return (
    <BillingForm
      userPlan={userPlan}
      projectsCount={projectsCount}
      proPlans={proPlans}
    />
  );
}

export function PlanUsageSkeleton() {
  return <BillingFormSkeleton />;
}
