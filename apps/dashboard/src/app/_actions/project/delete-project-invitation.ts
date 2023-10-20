"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { and, db, eq, isNull, projectInvitations, projects } from "@acme/db";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";

import { isOwnerCheck } from "~/app/_actions/schemas";
import { authenticatedAction } from "../authenticated-action";

export const deleteProjectInvitation = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      email: z.string().email(),
    })
    .superRefine(async ({ projectId, email }, ctx) => {
      await isOwnerCheck(projectId, userId, ctx);

      const invitationToDelete = await db
        .select()
        .from(projectInvitations)
        .where(
          and(
            eq(projectInvitations.projectId, projectId),
            eq(projectInvitations.email, email),
          ),
        )
        .then((x) => x[0]);

      if (!invitationToDelete) {
        ctx.addIssue({
          code: "custom",
          path: ["userIdToDelete"],
          message: "Invitation not found",
        });
      }
    }),
)(async ({ projectId, email }) => {
  await db
    .delete(projectInvitations)
    .where(
      and(
        eq(projectInvitations.projectId, projectId),
        eq(projectInvitations.email, email),
      ),
    );

  const project = await db
    .select({
      name: projects.name,
    })
    .from(projects)
    .where(and(eq(projects.id, projectId), isNull(projects.deletedAt)))
    .then((x) => x[0]!);

  await inngest.send({
    id: `notification/project.user.removed/${projectId}-${email}`,
    name: "notification/project.user.removed",
    data: {
      projectName: project.name,
      userEmail: email,
    },
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
