"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";

import { getProjects } from "~/lib/shared/gets";
import { ProjectsDropdownClient } from "./ProjectsDropdownClient";

export async function ProjectsDropdown() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const projects = await getProjects({
    userId: session.user.id,
  });

  return <ProjectsDropdownClient projects={projects} />;
}
