"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  and,
  db,
  eq,
  media,
  MediaForEntity,
  ne,
  projectMembers,
  projects,
  Role,
  sql,
} from "@bloghub/db";

import { $getUser } from "~/app/_api/get-user";
import { zactAuthenticated } from "~/lib/zact/server";
import { deleteProjectMedia } from "./delete-project-media";

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
  const project = await db
    .select({
      logo: projects.logo,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .then((x) => x[0]!);

  if (project.logo && project.logo !== logo) {
    await deleteProjectMedia({
      projectId,
      url: project.logo,
    });

    const allProjectLogos = await db
      .select({
        id: media.id,
        url: media.url,
      })
      .from(media)
      .where(
        and(
          eq(media.projectId, projectId),
          eq(media.forEntity, MediaForEntity.ProjectLogo),
          ne(media.url, logo ?? ""), // keep the new thumbnail
        ),
      );

    await Promise.all(
      allProjectLogos.map((media) =>
        deleteProjectMedia({
          projectId,
          url: media.url,
        }),
      ),
    );
  }

  await db
    .update(projects)
    .set({
      logo,
    })
    .where(eq(projects.id, projectId));

  revalidatePath(`/projects/${projectId}`);
});
