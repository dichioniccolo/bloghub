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
import { AppRoutes } from "@acme/lib/routes";
import { createDomain, deleteDomain } from "@acme/vercel";

import { authenticatedAction } from "../authenticated-action";
import { DomainSchema } from "../schemas";

export const updateDomain = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      newDomain: DomainSchema,
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
)(async ({ projectId, newDomain }) => {
  const project = await db
    .select({
      oldDomain: projects.domain,
    })
    .from(projects)
    .where(and(eq(projects.id, projectId), isNull(projects.deletedAt)))
    .then((x) => x[0]!);

  await deleteDomain(project.oldDomain);
  await createDomain(newDomain);

  await db
    .update(projects)
    .set({
      domain: newDomain,
    })
    .where(eq(projects.id, projectId));

  revalidatePath(AppRoutes.ProjectSettings(projectId));
});
