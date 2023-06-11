"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { deleteProject as deleteProjectBase } from "@acme/common/actions";
import { AppRoutes } from "@acme/common/routes";
import { and, db, eq, projectMembers, projects, sql } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const deleteProject = zact(
  z
    .object({
      userId: z.string().nonempty(),
      projectId: z.string().nonempty(),
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

      if (isOwnerCount.count === 0) {
        ctx.addIssue({
          code: "custom",
          message:
            "You must be the owner of the project to perform this action",
          path: ["projectId"],
        });
      }
    }),
)(async ({ userId, projectId }) => {
  const project = await db
    .select({
      id: projects.id,
      domain: projects.domain,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .innerJoin(
      projectMembers,
      and(
        eq(projects.id, projectMembers.projectId),
        eq(projectMembers.userId, userId),
        eq(projectMembers.role, "owner"),
      ),
    )
    .then((x) => x[0]!);

  await deleteProjectBase(project);

  redirect(AppRoutes.Dashboard);
});
