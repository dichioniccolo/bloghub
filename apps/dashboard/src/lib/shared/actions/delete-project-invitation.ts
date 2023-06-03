"use server";

import { AppRoutes } from "@acme/common/routes";
import { NotificationType, prisma, Role } from "@acme/db";
import { publishNotification } from "@acme/notifications";

import "isomorphic-fetch";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { zact } from "~/lib/zact/server";

export const deleteProjectInvitation = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
      email: z.string().email(),
    })
    .superRefine(async ({ userId, projectId, email }, ctx) => {
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

      const invitationToDelete = await prisma.invite.findFirst({
        where: {
          email,
          projectId,
        },
        select: {
          id: true,
        },
      });

      if (!invitationToDelete) {
        ctx.addIssue({
          code: "custom",
          path: ["userIdToDelete"],
          message: "Invitation not found",
        });
      }
    }),
)(async ({ projectId, email }) => {
  const { project } = await prisma.invite.delete({
    where: {
      projectId_email: {
        projectId,
        email,
      },
    },
    select: {
      project: {
        select: {
          name: true,
        },
      },
    },
  });

  await publishNotification(NotificationType.REMOVED_FROM_PROJECT, {
    projectName: project.name,
    userEmail: email,
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
