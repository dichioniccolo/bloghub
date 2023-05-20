"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { deleteDomain } from "@acme/common/external/vercel";
import { Role, prisma } from "@acme/db";

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
      domain: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  await deleteDomain(project.domain);

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  revalidatePath("/");
});
