"use server";

import { AppRoutes } from "@acme/common/routes";
import { NotificationType, prisma, Role } from "@acme/db";
import { publishNotification } from "@acme/notifications";

import "isomorphic-fetch";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { zact } from "~/lib/zact/server";

export const deleteProjectUser = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
      userIdToDelete: z.string(),
    })
    .superRefine(async ({ userId, projectId, userIdToDelete }, ctx) => {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          users: {
            some: {
              userId,
            },
          },
        },
        select: {
          users: {
            select: {
              role: true,
            },
            where: {
              userId,
            },
          },
        },
      });

      if (!project) {
        ctx.addIssue({
          code: "custom",
          path: ["projectId"],
          message: "Project not found",
        });
      }

      if (project?.users[0]?.role !== Role.OWNER) {
        ctx.addIssue({
          code: "custom",
          path: ["userId"],
          message: "You must be the owner of the project",
        });
      }

      const userToDelete = await prisma.projectUser.findFirst({
        where: {
          userId: userIdToDelete,
          projectId,
        },
        select: {
          id: true,
          role: true,
        },
      });

      if (!userToDelete) {
        ctx.addIssue({
          code: "custom",
          path: ["userIdToDelete"],
          message: "User not found",
        });
      }

      if (userToDelete?.role === Role.OWNER) {
        ctx.addIssue({
          code: "custom",
          path: ["userIdToDelete"],
          message: "You can't delete the owner of the project",
        });
      }
    }),
)(async ({ projectId, userIdToDelete }) => {
  const { user, project } = await prisma.projectUser.delete({
    where: {
      projectId_userId: {
        projectId,
        userId: userIdToDelete,
      },
    },
    select: {
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

  await publishNotification(NotificationType.REMOVED_FROM_PROJECT, {
    projectName: project.name,
    userEmail: user.email,
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
