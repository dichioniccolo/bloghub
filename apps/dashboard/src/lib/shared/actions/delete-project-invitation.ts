"use server";

import { AppRoutes } from "@acme/common/routes";
import {
  and,
  db,
  eq,
  projectInvitations,
  projectMembers,
  projects,
} from "@acme/db";
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
      const project = await db
        .select({
          member: {
            role: projectMembers.role,
          },
        })
        .from(projects)
        .where(eq(projects.id, projectId))
        .innerJoin(
          projectMembers,
          and(
            eq(projectMembers.projectId, projects.id),
            eq(projectMembers.userId, userId),
          ),
        )
        .then((x) => x[0]);
      if (!project) {
        ctx.addIssue({
          code: "custom",
          path: ["projectId"],
          message: "Project not found",
        });
      }

      if (project?.member?.role !== "owner") {
        ctx.addIssue({
          code: "custom",
          path: ["userId"],
          message: "You must be the owner of the project",
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

  await publishNotification("removed_from_project", {
    projectName: project.name,
    userEmail: email,
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
