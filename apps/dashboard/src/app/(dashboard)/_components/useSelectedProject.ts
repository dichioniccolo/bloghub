"use client";

import { usePathname } from "next/navigation";

import { type Project } from "@acme/db";

export function useSelectedProject(
  projects: Pick<Project, "id" | "logo" | "name">[],
) {
  const pathname = usePathname();

  if (pathname === "/" || !pathname?.startsWith("/projects/")) {
    return null;
  }

  const parsedId = pathname?.split("/")[2];

  const selectedProject = projects.find((x) => x.id === parsedId);

  return selectedProject;
}
