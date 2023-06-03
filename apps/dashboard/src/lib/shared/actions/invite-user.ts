"use server";

import { AppRoutes } from "@acme/common/routes";
import { NotificationType, prisma, Role } from "@acme/db";
import { publishNotification } from "@acme/notifications";

import "isomorphic-fetch";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { zact } from "~/lib/zact/server";

export const inviteUser = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
      email: z.string().email(),
    })
    .superRefine(async ({ projectId, userId, email }, ctx) => {
      const isOwnerCount = await prisma.projectUser.count({
        where: {
          projectId,
          userId,
          role: Role.OWNER,
        },
      });

      if (isOwnerCount === 0) {
        ctx.addIssue({
          code: "custom",
          message: "You do not have permission to invite users to this project",
          path: ["projectId"],
        });
      }

      const existingUser = await prisma.projectUser.count({
        where: {
          projectId,
          user: {
            email,
          },
        },
      });

      if (existingUser > 0) {
        ctx.addIssue({
          code: "custom",
          message: "A user with this email already exists in this project",
          path: ["email"],
        });
      }

      const existingInvite = await prisma.invite.count({
        where: {
          projectId,
          email,
        },
      });

      if (existingInvite > 0) {
        ctx.addIssue({
          code: "custom",
          message: "An invitation has already been sent to this email",
          path: ["email"],
        });
      }
    }),
)(async ({ email, projectId }) => {
  const ONE_WEEK_IN_SECONDS = 604800;

  await prisma.$transaction(async (tx) => {
    await tx.invite.create({
      data: {
        email,
        projectId,
        expiresAt: new Date(Date.now() + ONE_WEEK_IN_SECONDS * 1000),
      },
    });

    await publishNotification(NotificationType.PROJECT_INVITATION, {
      projectId,
      userEmail: email,
    });
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
