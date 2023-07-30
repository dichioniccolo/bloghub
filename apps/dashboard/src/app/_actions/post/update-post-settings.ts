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
  posts,
  projectMembers,
  projects,
  sql,
} from "@bloghub/db";

import { $getUser } from "~/app/_api/get-user";
import { AppRoutes } from "~/lib/common/routes";
import { zactAuthenticated } from "~/lib/zact/server";
import { deleteProjectMedia } from "../project/delete-project-media";

export const updatePostSettings = zactAuthenticated(
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
        postId: z.string().nonempty(),
        data: z.object({
          slug: z
            .string()
            .nonempty()
            .regex(/^[a-z0-9-]+$/i),
          thumbnailUrl: z.string().url().optional().nullable(),
          seoTitle: z.string().optional().nullable(),
          seoDescription: z.string().optional().nullable(),
        }),
      })
      .superRefine(async ({ projectId, postId, data: { slug } }, ctx) => {
        const post = await db
          .select({
            count: sql<number>`count(*)`.mapWith(Number),
          })
          .from(posts)
          .where(eq(posts.id, postId))
          .innerJoin(
            projects,
            and(eq(projects.id, posts.projectId), eq(projects.id, projectId)),
          )
          .innerJoin(
            projectMembers,
            and(
              eq(projectMembers.projectId, projects.id),
              eq(projectMembers.userId, userId),
            ),
          )
          .then((x) => x[0]!);

        if (post.count === 0) {
          ctx.addIssue({
            code: "custom",
            message:
              "You must be a member of the project to perform this action",
            path: ["projectId"],
          });
        }

        const postWithSameSlug = await db
          .select({
            count: sql<number>`count(*)`.mapWith(Number),
          })
          .from(posts)
          .where(
            and(
              eq(posts.slug, slug),
              eq(posts.projectId, projectId),
              ne(posts.id, postId),
            ),
          )
          .then((x) => x[0]!);

        if (postWithSameSlug.count > 0) {
          ctx.addIssue({
            code: "custom",
            message: "A post with the same slug already exists",
            path: ["slug"],
          });
        }
      }),
)(async ({
  projectId,
  postId,
  data: { slug, thumbnailUrl, seoTitle, seoDescription },
}) => {
  const post = await db
    .select({
      thumbnailUrl: posts.thumbnailUrl,
    })
    .from(posts)
    .where(and(eq(posts.id, postId), eq(posts.projectId, projectId)))
    .then((x) => x[0]!);

  if (post.thumbnailUrl && post.thumbnailUrl !== thumbnailUrl) {
    await deleteProjectMedia({
      projectId,
      url: post.thumbnailUrl,
    });

    const allThumbnailMedia = await db
      .select({
        id: media.id,
        url: media.url,
      })
      .from(media)
      .where(
        and(
          eq(media.projectId, projectId),
          eq(media.forEntity, MediaForEntity.PostThumbnail),
          ne(media.url, thumbnailUrl ?? ""), // keep the new thumbnail
        ),
      );

    await Promise.all(
      allThumbnailMedia.map((media) =>
        deleteProjectMedia({
          projectId,
          url: media.url,
        }),
      ),
    );
  }

  await db
    .update(posts)
    .set({
      slug,
      thumbnailUrl,
      seoTitle,
      seoDescription,
      hidden: false,
    })
    .where(and(eq(posts.id, postId), eq(posts.projectId, projectId)));

  revalidatePath(AppRoutes.PostEditor(projectId, postId));
});
