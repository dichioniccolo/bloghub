"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { and, db, eq, projectMembers, Role, sql } from "@bloghub/db";

import { $getUser } from "~/app/_api/get-user";
import { AppRoutes } from "~/lib/common/routes";
import { zactAuthenticated } from "~/lib/zact/server";

export const quitProject = zactAuthenticated(
  async () => {
    const user = await $getUser();

    return {
      userId: user.id,
    };
  },
  ({ userId }) =>
    z
      .object({
        projectId: z.string(),
      })
      .superRefine(async ({ projectId }, ctx) => {
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

        if (isOwnerCount.count > 0) {
          ctx.addIssue({
            code: "custom",
            message: "You cannot quit a project you own.",
            path: ["projectId"],
          });
        }
      }),
)(async ({ projectId }, { userId }) => {
  await db
    .delete(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId),
      ),
    );

  redirect(AppRoutes.Dashboard);
});
