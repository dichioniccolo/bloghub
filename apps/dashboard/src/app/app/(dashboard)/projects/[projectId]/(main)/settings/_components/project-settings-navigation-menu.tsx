"use client";

import { useMemo } from "react";

import { SidebarNav } from "~/components/sidebar-nav";
import { AppRoutes } from "~/lib/routes";

interface Props {
  projectId: string;
}

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
