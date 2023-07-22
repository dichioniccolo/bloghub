"use server";

import { z } from "zod";

import { and, db, eq, projectMembers, projects, Role, sql } from "@bloghub/db";

import { $getUser } from "~/app/_api/get-user";
import { zactAuthenticated } from "~/lib/zact/server";

export const updateProjectName = zactAuthenticated(
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
        name: z.string().nonempty(),
      })
      .superRefine(async ({ projectId }, ctx) => {
        const project = await db
          .select({
            count: sql<number>`count(*)`.mapWith(Number),
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

        if (project.count === 0) {
          ctx.addIssue({
            code: "custom",
            message:
              "You must be a member of the project or be the owner to perform this action",
            path: ["projectId"],
          });
        }
      }),
)(async ({ projectId, name }) => {
  await db
    .update(projects)
    .set({
      name,
    })
    .where(eq(projects.id, projectId));
});
