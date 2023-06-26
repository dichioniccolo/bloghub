"use server";

import { revalidatePath } from "next/cache";
import { createDomain, deleteDomain } from "@bloghub/common/external/vercel";
import { AppRoutes } from "@bloghub/common/routes";
import { and, db, eq, projectMembers, projects, Role, sql } from "@bloghub/db";
import { zactAuthenticated } from "@bloghub/zact/server";
import { z } from "zod";

import { $getUser } from "~/app/_api/get-user";
import { DomainSchema } from "../schemas";

export const updateDomain = zactAuthenticated(
  async () => {
    const user = await $getUser();

    return {
      userId: user.id,
    };
  },
  ({ userId }) =>
    z
      .object({
        projectId: z.string().nonempty(),
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
