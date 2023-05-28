import { z } from "zod";

import { Role, prisma } from "@acme/db";

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
  await prisma.projectUser.delete({
    where: {
      projectId_userId: {
        projectId,
        userId: userIdToDelete,
      },
    },
  });
});
