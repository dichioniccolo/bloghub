"use server";

import { getProjects } from "~/lib/shared/api/projects";
import { ProjectsDropdownClient } from "./ProjectsDropdownClient";

export async function ProjectsDropdown() {
  const projects = await getProjects();

  return <ProjectsDropdownClient projects={projects} />;
}
