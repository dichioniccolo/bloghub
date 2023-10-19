"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { and, db, eq, posts, projectMembers, projects, sql } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";

import { authenticatedAction } from "../authenticated-action";

// TODO: handle better with seo, thumbnail, etc
export const togglePublishedPost = authenticatedAction(({ userId }) =>
  z
    .object({
      postId: z.string().min(1),
      projectId: z.string().min(1),
    })
    .superRefine(async ({ postId, projectId }, ctx) => {
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
    }),
)(async ({ projectId, postId }) => {
  const post = await db
    .select({
      hidden: posts.hidden,
    })
    .from(posts)
    .where(eq(posts.id, postId))
    .then((x) => x[0]!);

  await db
    .update(posts)
    .set({
      hidden: !post.hidden,
    })
    .where(eq(posts.id, postId));

  revalidatePath(AppRoutes.PostEditor(projectId, postId));
});
