"use server";

import { z } from "zod";

import { and, db, eq, projectMembers, projects, Role, sql } from "@bloghub/db";

import { $getUser } from "~/app/_api/get-user";
import { inngest } from "~/lib/inngest";
import { zactAuthenticated } from "~/lib/zact/server";

export const deleteProject = zactAuthenticated(
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
    .where(eq(projects.id, projectId))
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
