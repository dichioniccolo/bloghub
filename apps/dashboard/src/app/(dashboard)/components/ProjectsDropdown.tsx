"use server";

import { cache } from "react";
import { currentUser } from "@clerk/nextjs";

import { prisma } from "@acme/db";

import { ProjectsDropdownClient } from "./ProjectsDropdownClient";

const getProjects = cache(async (userId: string) => {
  return await prisma.project.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
  });
});

export async function ProjectsDropdown() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const projects = await getProjects(user.id);

  return <ProjectsDropdownClient projects={projects} />;
}
