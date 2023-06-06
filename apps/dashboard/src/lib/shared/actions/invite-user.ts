"use server";

import { AppRoutes } from "@acme/common/routes";
import {
  and,
  db,
  eq,
  projectInvitations,
  projectMembers,
  sql,
  users,
} from "@acme/db";
import { publishNotification } from "@acme/notifications";

import "isomorphic-fetch";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { zact } from "~/lib/zact/server";

export const inviteUser = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
      email: z.string().email(),
    })
    .superRefine(async ({ projectId, userId, email }, ctx) => {
      const projectMemberCount = await db
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

      if (projectMemberCount.count === 0) {
        ctx.addIssue({
          code: "custom",
          message: "You do not have permission to invite users to this project",
          path: ["projectId"],
        });
      }

      const existingUser = await db
        .select({
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(projectMembers)
        .where(eq(projectMembers.projectId, projectId))
        .innerJoin(users, eq(users.email, email))
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
    await tx.insert(projectInvitations).values({
      email,
      projectId,
      expiresAt: new Date(Date.now() + ONE_WEEK_IN_SECONDS * 1000),
    });

    await publishNotification("project_invitation", {
      projectId,
      userEmail: email,
    });
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
