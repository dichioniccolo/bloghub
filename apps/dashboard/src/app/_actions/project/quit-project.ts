"use server";

import { z } from "zod";

import { and, db, eq, projectMembers, Role, sql } from "@acme/db";

import { authenticatedAction } from "../authenticated-action";

export const quitProject = authenticatedAction(({ userId }) =>
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

  // TODO: implement when fixed
  // redirect(AppRoutes.Dashboard);
});
