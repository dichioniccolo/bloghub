"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { AppRoutes } from "@acme/common/routes";
import { and, db, eq, projectMembers, sql } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const quitProject = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
    })
    .superRefine(async ({ userId, projectId }, ctx) => {
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

      if (isOwnerCount.count > 0) {
        ctx.addIssue({
          code: "custom",
          message: "You cannot quit a project you own.",
          path: ["projectId"],
        });
      }
    }),
)(async ({ userId, projectId }) => {
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
