"use server";

import { z } from "zod";

import {
  and,
  db,
  eq,
  isNull,
  projectMembers,
  projects,
  Role,
  sql,
} from "@acme/db";
import { inngest } from "@acme/inngest";

import { authenticatedAction } from "../authenticated-action";

export const deleteProject = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
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

      if (isOwnerCount.count === 0) {
        ctx.addIssue({
          code: "custom",
          message:
            "You must be the owner of the project to perform this action",
          path: ["projectId"],
        });
      }
    }),
)(async ({ projectId }, { userId }) => {
  const project = await db
    .select({
      id: projects.id,
      domain: projects.domain,
    })
    .from(projects)
    .where(and(eq(projects.id, projectId), isNull(projects.deletedAt)))
    .innerJoin(
      projectMembers,
      and(
        eq(projects.id, projectMembers.projectId),
        eq(projectMembers.userId, userId),
        eq(projectMembers.role, Role.Owner),
      ),
    )
    .then((x) => x[0]!);

  await inngest.send({
    name: "project/delete",
    data: project,
  });

  // TODO: implement when fixed
  // redirect(AppRoutes.Dashboard);
});
