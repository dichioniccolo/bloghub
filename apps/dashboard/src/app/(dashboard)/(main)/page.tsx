import { Suspense } from "react";
import type { Metadata, ServerRuntime } from "next";

import { DashboardHeader } from "~/components/dashboard-header";
import { DashboardShell } from "~/components/dashboard-shell";
import { CreateProjectButton } from "./_components/create-project-button";
import {
  ProjectsCards,
  ProjectsCardsSkeleton,
} from "./_components/projects-cards";

export const metadata = {
  title: "Dashboard",
} satisfies Metadata;

export const revalidate = 3600;

export const runtime: ServerRuntime = "edge";

export default function AppDashboardMainPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="My Projects">
        <CreateProjectButton />
      </DashboardHeader>
      <Suspense fallback={<ProjectsCardsSkeleton />}>
        <ProjectsCards />
      </Suspense>
    </DashboardShell>
  );
}
