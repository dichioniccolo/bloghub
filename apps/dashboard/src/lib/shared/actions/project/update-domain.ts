"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createDomain, deleteDomain } from "@acme/common/external/vercel";
import { AppRoutes } from "@acme/common/routes";
import { and, db, eq, projectMembers, projects, sql } from "@acme/db";

import { zact } from "~/lib/zact/server";
import { DomainSchema } from "../schemas";

export const updateDomain = zact(
  z
    .object({
      userId: z.string().nonempty(),
      projectId: z.string().nonempty(),
      newDomain: DomainSchema,
    })
    .superRefine(async ({ projectId, userId }, ctx) => {
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
