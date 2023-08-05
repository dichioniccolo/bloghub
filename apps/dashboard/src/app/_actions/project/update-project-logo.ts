"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { and, db, eq, projectMembers, projects, Role, sql } from "@bloghub/db";

import { $getUser } from "~/app/_api/get-user";
import { inngest } from "~/lib/inngest";
import { zactAuthenticated } from "~/lib/zact/server";

export const updateProjectLogo = zactAuthenticated(
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
        logo: z.string().optional().nullable(),
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
)(async ({ projectId, logo }) => {
  const oldLogoUrl = await db
    .select({
      logo: projects.logo,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .then((x) => x[0]!)
    .then((x) => x.logo);

  await db
    .update(projects)
    .set({
      logo,
    })
    .where(eq(projects.id, projectId));

  await inngest.send({
    name: "project/update.logo",
    data: {
      projectId,
      oldLogoUrl,
      newLogoUrl: logo,
    },
  });

  revalidatePath(`/projects/${projectId}`);
});
