"use server";

import { z } from "zod";

import { verifyProjectDomain } from "@acme/common/external/vercel/actions";
import { and, db, eq, projectMembers, projects, Role, sql } from "@acme/db";
import { zact } from "@acme/zact/server";

export const verifyDomain = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
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
)(async ({ userId, projectId }) => {
  const project = await db
    .select({
      domain: projects.domain,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, projects.id),
        eq(projectMembers.userId, userId),
        eq(projectMembers.role, Role.Owner),
      ),
    )
    .then((x) => x[0]!);

  return await verifyProjectDomain(project.domain);
});

export type VerifyDomain = Awaited<ReturnType<typeof verifyProjectDomain>>;
