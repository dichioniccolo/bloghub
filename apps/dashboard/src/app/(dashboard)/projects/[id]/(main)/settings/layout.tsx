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
      <DashboardHeader heading="Settings" />
      <ProjectSettingsNavigationMenu projectId={id} />
      {children}
    </DashboardShell>
  );
}
