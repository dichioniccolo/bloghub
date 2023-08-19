import { getProjectsCount } from "~/app/_api/projects";
import { getProPlans } from "~/app/_api/stripe";
import { getUserPlan } from "~/app/_api/user";
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
