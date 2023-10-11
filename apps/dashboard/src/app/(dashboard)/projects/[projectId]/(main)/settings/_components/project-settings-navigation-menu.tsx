"use client";

import { useMemo } from "react";

import { AppRoutes } from "@acme/lib/routes";

import { SidebarNav } from "~/components/sidebar-nav";

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
