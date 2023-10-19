"use server";

import { revalidatePath } from "next/cache";
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

import { authenticatedAction } from "../authenticated-action";

export const updateProjectLogo = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      logo: z.string().optional().nullable(),
    })
    .superRefine(async ({ projectId }, ctx) => {
      const project = await db
        .select({
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(projects)
        .where(and(eq(projects.id, projectId), isNull(projects.deletedAt)))
        .innerJoin(
          projectMembers,
          and(
            eq(projectMembers.projectId, projects.id),
            eq(projectMembers.userId, userId),
            eq(projectMembers.role, Role.Owner),
          ),
        )
        .then((x) => x[0]!);

      if (project.count === 0) {
        ctx.addIssue({
          code: "custom",
          message:
            "You must be a member of the project or be the owner to perform this action",
          path: ["projectId"],
        });
      }
    }),
)(async ({ projectId, logo }) => {
  await db
    .update(projects)
    .set({
      logo,
    })
    .where(eq(projects.id, projectId));

  revalidatePath(`/projects/${projectId}`);
});
