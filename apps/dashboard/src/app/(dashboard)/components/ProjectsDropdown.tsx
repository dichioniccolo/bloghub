"use server";

import { cache } from "react";
import { currentUser } from "@clerk/nextjs";

import { prisma } from "@acme/db";

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

  return <div>{JSON.stringify(projects)}</div>;
}
