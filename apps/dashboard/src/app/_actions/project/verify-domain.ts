"use server";

import { verifyProjectDomain } from "@bloghub/common/external/vercel/actions";
import { and, db, eq, projectMembers, projects, Role, sql } from "@bloghub/db";
import { zactAuthenticated } from "@bloghub/zact/server";
import { z } from "zod";

import { $getUser } from "~/app/_api/get-user";

export const verifyDomain = zactAuthenticated(
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
