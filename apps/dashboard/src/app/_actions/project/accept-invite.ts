"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { and, db, eq, gte, schema, withExists } from "@acme/db";
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
    const invitationExists = await withExists(
      schema.projectInvitations,
      and(
        eq(schema.projectInvitations.email, user.email),
        eq(schema.projectInvitations.projectId, projectId),
        gte(schema.projectInvitations.expiresAt, new Date()),
      ),
    );

    if (!invitationExists) {
      throw new ErrorForClient("Invite not found or expires");
    }

    const project = await db.transaction(async (tx) => {
      await tx
        .delete(schema.projectInvitations)
        .where(
          and(
            eq(schema.projectInvitations.email, user.email),
            eq(schema.projectInvitations.projectId, projectId),
          ),
        );

      await tx.insert(schema.projectMembers).values({
        projectId,
        userId: user.id,
        role: "EDITOR",
      });

      return await tx.query.projects.findFirst({
        where: eq(schema.projects.id, projectId),
        columns: {
          name: true,
        },
      });
    });

    if (!project) {
      return;
    }

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
