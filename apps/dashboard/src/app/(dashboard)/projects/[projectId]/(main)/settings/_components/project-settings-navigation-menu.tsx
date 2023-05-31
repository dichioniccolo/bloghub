"use client";

import { useMemo } from "react";

import { SidebarNav } from "~/app/_components/sidebar-nav";
import { Routes } from "~/app/routes";

type Props = {
  projectId: string;
};

export function ProjectSettingsNavigationMenu({ projectId }: Props) {
  const sidebarNavItems = useMemo(
    () => [
      {
        title: "General",
        href: Routes.ProjectSettings(projectId),
      },
      {
        title: "Members",
        href: Routes.ProjectSettingsMembers(projectId),
      },
    ],
    [projectId],
  );

  return <SidebarNav items={sidebarNavItems} />;
}
