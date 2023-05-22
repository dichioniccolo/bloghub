"use server";

import { Role, prisma } from "@acme/db";

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

export async function getUserTotalUsage(userId: string) {
  const usage = await prisma.visit.count({
    where: {
      project: {
        users: {
          some: {
            role: Role.OWNER,
            userId,
          },
        },
      },
    },
  });

  return usage;
}

export async function getProjectTotalUsage(userId: string, projectId: string) {
  const usage = await prisma.visit.count({
    where: {
      project: {
        id: projectId,
        users: {
          some: {
            userId,
          },
        },
      },
    },
  });

  return usage;
}

export async function getPostTotalUsage(
  userId: string,
  projectId: string,
  postId: string,
) {
  const usage = await prisma.visit.count({
    where: {
      postId,
      project: {
        id: projectId,
        users: {
          some: {
            role: Role.OWNER,
            userId,
          },
        },
      },
    },
  });

  return usage;
}
