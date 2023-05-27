"use client";

import { useMemo } from "react";

import { SidebarNav } from "~/app/_components/sidebar-nav";

type Props = {
  projectId: string;
};

export function ProjectSettingsNavigationMenu({ projectId }: Props) {
  const basePath = `/projects/${projectId}/settings`;

  const sidebarNavItems = useMemo(
    () => [
      {
        title: "General",
        href: basePath,
      },
      {
        title: "Members",
        href: `${basePath}/members`,
      },
    ],
    [basePath],
  );

  return <SidebarNav items={sidebarNavItems} />;
}
