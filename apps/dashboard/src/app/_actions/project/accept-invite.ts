"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@acme/db";
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
    const invitationExistsCount = await prisma.projectInvitations.count({
      where: {
        email: user.email,
        projectId,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (invitationExistsCount === 0) {
      throw new ErrorForClient("Invite not found or expires");
    }

    const project = await prisma.projects.update({
      where: {
        id: projectId,
      },
      data: {
        invitations: {
          delete: {
            email_projectId: {
              email: user.email,
              projectId,
            },
          },
        },
        members: {
          create: {
            userId: user.id,
            role: "EDITOR",
          },
        },
      },
      select: {
        name: true,
      },
    });

    await inngest.send({
      id: `notification/invitation.accepted/${projectId}-${user.email}`,
      name: "notification/invitation.accepted",
      data: {
        projectId,
        projectName: project.name,
        userEmail: user.email,
      },
    });

    redirect(AppRoutes.ProjectDashboard(projectId));
  },
});
