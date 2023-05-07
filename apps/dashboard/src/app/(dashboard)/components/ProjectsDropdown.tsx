"use server";

import { cache } from "react";
import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";
import { prisma } from "@acme/db";

import { CreateProjectDialogForm } from "~/components/dialogs/create-project-dialog/form";
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
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const projects = await getProjects(session.user.id);

  return (
    <ProjectsDropdownClient
      projects={projects}
      // @ts-expect-error react async component
      form={<CreateProjectDialogForm />}
    />
  );
}
