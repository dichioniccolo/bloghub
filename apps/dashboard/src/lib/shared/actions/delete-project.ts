"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { deleteProject as deleteProjectBase } from "@acme/common/actions";
import { AppRoutes } from "@acme/common/routes";
import { prisma, Role } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const deleteProject = zact(
  z.object({
    userId: z.string(),
    projectId: z.string(),
  }),
)(async ({ userId, projectId }) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      users: {
        some: {
          userId,
          role: Role.OWNER,
        },
      },
    },
    select: {
      id: true,
      domain: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  await deleteProjectBase(project);

  revalidatePath(AppRoutes.Dashboard);
  redirect(AppRoutes.Dashboard);
});
