"use server";

import { z } from "zod";

import { prisma, Role } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const acceptInvite = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
    })
    .superRefine(async ({ userId, projectId }, ctx) => {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          email: true,
        },
      });

      if (!user) {
        ctx.addIssue({
          code: "custom",
          message: "User not found",
          path: ["userId"],
        });
      } else {
        const invite = await prisma.invite.count({
          where: {
            projectId,
            email: user.email,
            expiresAt: {
              gte: new Date(),
            },
          },
        });

        if (invite === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Invite not found",
            path: ["projectId"],
          });
        }
      }
    }),
)(async ({ userId, projectId }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  await prisma.$transaction(async (tx) => {
    await tx.invite.delete({
      where: {
        projectId_email: {
          projectId,
          email: user.email,
        },
      },
    });
    await tx.projectUser.create({
      data: {
        role: Role.EDITOR,
        projectId,
        userId,
      },
    });
  });
});
