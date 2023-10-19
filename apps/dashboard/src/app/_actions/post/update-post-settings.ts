"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  and,
  db,
  eq,
  ne,
  posts,
  projectMembers,
  projects,
  sql,
} from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";

import { authenticatedAction } from "../authenticated-action";

export const updatePostSettings = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      postId: z.string().min(1),
      data: z.object({
        slug: z
          .string()
          .min(1)
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
          message: "You must be a member of the project to perform this action",
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
