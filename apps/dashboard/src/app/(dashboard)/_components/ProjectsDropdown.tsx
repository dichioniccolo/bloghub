"use server";

import { getProjects } from "~/app/api";
import { ProjectsDropdownClient } from "./ProjectsDropdownClient";

export async function ProjectsDropdown() {
  const projects = await getProjects();

  return <ProjectsDropdownClient projects={projects} />;
}
