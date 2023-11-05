"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db, Role } from "@acme/db";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";

import { authenticatedAction } from "../authenticated-action";

export const acceptInvite = authenticatedAction(({ userEmail }) =>
  z
    .object({
      projectId: z.string().min(1),
    })
    .superRefine(async ({ projectId }, ctx) => {
      const count = await db.projectInvitation.count({
        where: {
          email: userEmail,
          projectId,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (count === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Invite not found",
          path: ["projectId"],
        });
      }
    }),
)(async ({ projectId }, { userId, userEmail }) => {
  await db.$transaction(async (tx) => {
    await tx.projectInvitation.delete({
      where: {
        email_projectId: {
          email: userEmail,
          projectId,
        },
      },
    });

    const projectMember = await tx.projectMember.create({
      data: {
        projectId,
        userId,
        role: Role.EDITOR,
      },
      select: {
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    await inngest.send({
      id: `notification/invitation.accepted/${projectId}-${userEmail}`,
      name: "notification/invitation.accepted",
      data: {
        projectId,
        projectName: projectMember.project.name,
        userEmail,
      },
    });
  });

  redirect(AppRoutes.ProjectDashboard(projectId));
});
