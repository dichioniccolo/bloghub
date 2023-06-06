"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createDomain, deleteDomain } from "@acme/common/external/vercel";
import { AppRoutes } from "@acme/common/routes";
import { and, db, eq, projectMembers, projects, sql } from "@acme/db";

import { zact } from "~/lib/zact/server";
import { DomainSchema } from "./schemas";

export const updateDomain = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
      newDomain: DomainSchema,
    })
    .superRefine(async (input, ctx) => {
      const { projectId, userId } = input;

      const projectMember = await db
        .select({
          count: sql<number>`count(*)`.mapWith(Number),
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

      if (projectMember.count === 0) {
        ctx.addIssue({
          code: "custom",
          message:
            "You must be a member of the project or you don't have the required permissions to perform this action",
          path: ["newDomain"],
        });
      }
    }),
)(async ({ projectId, newDomain }) => {
  const project = await db
    .select({
      oldDomain: projects.domain,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
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
