import { Skeleton } from "@acme/ui/components/skeleton";

import { DashboardHeader } from "~/components/dashboard-header";
import { DashboardShell } from "~/components/dashboard-shell";
import { CreateProjectButton } from "./_components/create-project-button";
import { ProjectsCardsSkeleton } from "./_components/projects-cards";

export default function Loading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="My Projects">
        <Skeleton>
          <CreateProjectButton
            buttonProps={{
              disabled: true,
            }}
          />
        </Skeleton>
      </DashboardHeader>
      <ProjectsCardsSkeleton />
    </DashboardShell>
  );
}
