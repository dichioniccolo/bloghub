"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db, Role } from "@acme/db";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";

import { authenticatedAction } from "../authenticated-action";
import { isOwnerCheck } from "../schemas";

export const deleteProjectUser = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      userIdToDelete: z.string().min(1),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isOwnerCheck(projectId, userId, ctx);
    }),
)(async ({ projectId, userIdToDelete }) => {
  const userToDelete = await db.projectMember.findFirst({
    where: {
      projectId,
      userId: userIdToDelete,
    },
    select: {
      role: true,
      user: {
        select: {
          email: true,
        },
      },
      project: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!userToDelete) {
    return;
  }

  if (userToDelete?.role === Role.OWNER) {
    throw new Error("Cannot delete owner");
  }

  await db.projectMember.delete({
    where: {
      projectId_userId: {
        projectId,
        userId: userIdToDelete,
      },
    },
  });

  await inngest.send({
    id: `notification/project.user.removed/${projectId}-${userToDelete.user.email}`,
    name: "notification/project.user.removed",
    data: {
      projectName: userToDelete.project.name,
      userEmail: userToDelete.user.email,
    },
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
