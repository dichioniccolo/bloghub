"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { AppRoutes } from "@acme/common/routes";
import {
  and,
  db,
  eq,
  gte,
  projectInvitations,
  projectMembers,
  users,
} from "@acme/db";

import { zact } from "~/lib/zact/server";

export const acceptInvite = zact(
  z
    .object({
      userId: z.string().nonempty(),
      projectId: z.string().nonempty(),
    })
    .superRefine(async ({ userId, projectId }, ctx) => {
      const user = await db
        .select({
          email: users.email,
        })
        .from(users)
        .where(eq(users.id, userId))
        .then((x) => x[0]);

      if (!user) {
        ctx.addIssue({
          code: "custom",
          message: "User not found",
          path: ["userId"],
        });
      } else {
        const invite = await db
          .select({
            email: projectInvitations.email,
          })
          .from(projectInvitations)
          .where(
            and(
              eq(projectInvitations.projectId, projectId),
              eq(projectInvitations.email, user.email),
              gte(projectInvitations.expiresAt, new Date()),
            ),
          )
          .then((x) => x[0]);

        if (!invite) {
          ctx.addIssue({
            code: "custom",
            message: "Invite not found",
            path: ["projectId"],
          });
        }
      }
    }),
)(async ({ userId, projectId }) => {
  const user = await db
    .select({
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, userId))
    .then((x) => x[0]!);

  await db.transaction(async (tx) => {
    await tx
      .delete(projectInvitations)
      .where(
        and(
          eq(projectInvitations.projectId, projectId),
          eq(projectInvitations.email, user.email),
        ),
      );

    await tx.insert(projectMembers).values({
      projectId,
      userId,
      role: "editor",
    });
  });

  redirect(AppRoutes.ProjectDashboard(projectId));
});
