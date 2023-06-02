"use client";

import { useMemo } from "react";

import { AppRoutes } from "@acme/common/routes";

import { SidebarNav } from "~/app/_components/sidebar-nav";

type Props = {
  projectId: string;
};

export function ProjectSettingsNavigationMenu({ projectId }: Props) {
  const sidebarNavItems = useMemo(
    () => [
      {
        title: "General",
        href: AppRoutes.ProjectSettings(projectId),
      },
      {
        title: "Members",
        href: AppRoutes.ProjectSettingsMembers(projectId),
      },
    ],
    [projectId],
  );

  return <SidebarNav items={sidebarNavItems} />;
}
