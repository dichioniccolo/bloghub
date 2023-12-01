"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db, Role } from "@acme/db";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";

export const acceptInvite = createServerAction({
  actionName: "acceptInvite",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: z.string().min(1),
  }),
  action: async ({ input: { projectId }, ctx: { user } }) => {
    const inviteExists = await db.projectInvitation.exists({
      where: {
        email: user.email,
        projectId,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!inviteExists) {
      throw new ErrorForClient("Invite not found or expires");
    }

    await db.$transaction(async (tx) => {
      await tx.projectInvitation.delete({
        where: {
          email_projectId: {
            email: user.email,
            projectId,
          },
        },
      });

      const projectMember = await tx.projectMember.create({
        data: {
          projectId,
          userId: user.id,
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
        id: `notification/invitation.accepted/${projectId}-${user.email}`,
        name: "notification/invitation.accepted",
        data: {
          projectId,
          projectName: projectMember.project.name,
          userEmail: user.email,
        },
      });
    });

    redirect(AppRoutes.ProjectDashboard(projectId));
  },
});
