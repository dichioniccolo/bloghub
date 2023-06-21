"use server";

import { AppRoutes } from "@acme/common/routes";
import {
  and,
  db,
  eq,
  Notification,
  projectInvitations,
  projectMembers,
  projects,
  Role,
  sql,
} from "@acme/db";
import { publishNotification } from "@acme/notifications/publish";

import "isomorphic-fetch";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { zact } from "@acme/zact/server";

export const deleteProjectInvitation = zact(
  z
    .object({
      userId: z.string().nonempty(),
      projectId: z.string().nonempty(),
      email: z.string().email(),
    })
    .superRefine(async ({ userId, projectId, email }, ctx) => {
      const isOwnerCount = await db
        .select({
          count: sql<number>`count(${projectMembers.userId})`.mapWith(Number),
        })
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, userId),
            eq(projectMembers.role, Role.Owner),
          ),
        )
        .then((x) => x[0]!);

      if (isOwnerCount.count === 0) {
        ctx.addIssue({
          code: "custom",
          message:
            "You must be the owner of the project to perform this action",
          path: ["projectId"],
        });
      }

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
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .then((x) => x[0]!);

  await publishNotification(Notification.RemovedFromProject, {
    projectName: project.name,
    userEmail: email,
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
