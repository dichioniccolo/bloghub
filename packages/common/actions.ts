"use server";

import { prisma } from "@acme/db";

import { deleteDomain } from "./external/vercel";

export async function deleteProject(project: { id: string; domain: string }) {
  await prisma.$transaction(async (tx) => {
    await deleteDomain(project.domain);

    // TODO: Delete project media

    await tx.project.delete({
      where: {
        id: project.id,
      },
    });
  });
}
