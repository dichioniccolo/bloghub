"use server";

import { z } from "zod";

import { and, db, eq, media, projectMembers, projects, sql } from "@acme/db";

import { $getUser } from "~/app/_api/get-user";
import { deleteMedia } from "~/lib/common/external/media/actions";
import { zactAuthenticated } from "~/lib/zact/server";

export const deleteProjectMedia = zactAuthenticated(
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
        url: z.string().url(),
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
            ),
          )
          .then((x) => x[0]!);

        if (project.count === 0) {
          ctx.addIssue({
            code: "custom",
            message:
              "You must be a member of the project to perform this action",
            path: ["projectId"],
          });
        }
      }),
)(async ({ projectId, url }) => {
  const dbMedia = await db
    .select()
    .from(media)
    .where(and(eq(media.projectId, projectId), eq(media.url, url)))
    .then((x) => x[0]);

  if (!dbMedia) {
    return;
  }

  await deleteMedia(dbMedia.url);
  await db.delete(media).where(eq(media.id, dbMedia.id));
});
