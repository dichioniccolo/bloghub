"use server";

import type { Session } from "@acme/auth";

import { getProjects } from "~/app/_api/projects";
import { ProjectsDropdownClient } from "./projects-dropdown-client";

interface Props {
  session: Session;
}

export async function ProjectsDropdown({ session }: Props) {
  const projects = await getProjects();

  return <ProjectsDropdownClient session={session} projects={projects} />;
}
