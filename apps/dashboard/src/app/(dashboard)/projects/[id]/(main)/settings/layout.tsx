import { type PropsWithChildren } from "react";

import { DashboardHeader } from "~/app/_components/dashboard-header";
import { DashboardShell } from "~/app/_components/dashboard-shell";
import { ProjectSettingsNavigationMenu } from "./_components/project-settings-navigation-menu";

type Props = { params: { id: string } };

export default function Layout({
  children,
  params: { id },
}: PropsWithChildren<Props>) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Project Settings" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <ProjectSettingsNavigationMenu projectId={id} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </DashboardShell>
  );
}
