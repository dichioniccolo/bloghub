"use server";

import { AppRoutes } from "@acme/common/routes";
import {
  and,
  db,
  eq,
  projectInvitations,
  projectMembers,
  projects,
  sql,
  users,
} from "@acme/db";
import { publishNotification } from "@acme/notifications/publish";

import "isomorphic-fetch";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { zact } from "~/lib/zact/server";

export const inviteUser = zact(
  z
    .object({
      userId: z.string().nonempty(),
      projectId: z.string().nonempty(),
      email: z.string().email(),
    })
    .superRefine(async ({ projectId, userId, email }, ctx) => {
      const isOwnerCount = await db
        .select({
          count: sql<number>`count(${projectMembers.userId})`.mapWith(Number),
        })
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, userId),
            eq(projectMembers.role, "owner"),
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

      const existingUser = await db
        .select({
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(projectMembers)
        .where(eq(projectMembers.projectId, projectId))
        .innerJoin(
          users,
          and(eq(users.id, projectMembers.userId), eq(users.email, email)),
        )
        .then((x) => x[0]!);

      if (existingUser.count > 0) {
        ctx.addIssue({
          code: "custom",
          message: "A user with this email already exists in this project",
          path: ["email"],
        });
      }

      const existingInvite = await db
        .select({
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(projectInvitations)
        .where(
          and(
            eq(projectInvitations.projectId, projectId),
            eq(projectInvitations.email, email),
          ),
        )
        .then((x) => x[0]!);

      if (existingInvite.count > 0) {
        ctx.addIssue({
          code: "custom",
          message: "An invitation has already been sent to this email",
          path: ["email"],
        });
      }
    }),
)(async ({ email, projectId }) => {
  const ONE_WEEK_IN_SECONDS = 604800;

  await db.transaction(async (tx) => {
    const project = await tx
      .select({
        name: projects.name,
      })
      .from(projects)
      .where(eq(projects.id, projectId))
      .then((x) => x[0]!);

    await tx.insert(projectInvitations).values({
      email,
      projectId,
      expiresAt: new Date(Date.now() + ONE_WEEK_IN_SECONDS * 1000),
    });

    await publishNotification("project_invitation", {
      projectId,
      projectName: project.name,
      userEmail: email,
    });
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
