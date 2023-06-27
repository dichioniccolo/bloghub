"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  and,
  db,
  eq,
  gte,
  projectInvitations,
  projectMembers,
  Role,
  users,
} from "@bloghub/db";

import { $getUser } from "~/app/_api/get-user";
import { AppRoutes } from "~/lib/common/routes";
import { zactAuthenticated } from "~/lib/zact/server";

export const acceptInvite = zactAuthenticated(
  async () => {
    const user = await $getUser();

    return {
      userId: user.id,
    };
  },
  ({ userId }) =>
    z
      .object({
        projectId: z.string().nonempty(),
      })
      .superRefine(async ({ projectId }, ctx) => {
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
)(async ({ projectId }, { userId }) => {
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
      role: Role.Editor,
    });
  });

  redirect(AppRoutes.ProjectDashboard(projectId));
});
