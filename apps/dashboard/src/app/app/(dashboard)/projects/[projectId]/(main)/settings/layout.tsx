import type { PropsWithChildren } from "react";

import { DashboardHeader } from "~/components/dashboard-header";
import { DashboardShell } from "~/components/dashboard-shell";
import { ProjectSettingsNavigationMenu } from "./_components/project-settings-navigation-menu";

interface Props {
  params: { projectId: string };
}

export default function Layout({
  children,
  params: { projectId },
}: PropsWithChildren<Props>) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Project Settings" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <ProjectSettingsNavigationMenu projectId={projectId} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </DashboardShell>
  );
}
