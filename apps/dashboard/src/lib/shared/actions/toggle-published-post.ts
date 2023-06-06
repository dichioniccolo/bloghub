"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AppRoutes } from "@acme/common/routes";
import { and, db, eq, posts, projectMembers, sql } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const togglePublishedPost = zact(
  z
    .object({
      postId: z.string().refine(async (postId) => {
        const post = await db
          .select({
            count: sql<number>`count(*)`.mapWith(Number),
          })
          .from(posts)
          .where(eq(posts.id, postId))
          .then((x) => x[0]!);

        return post.count === 1;
      }, "Post does not exist"),
      projectId: z.string(),
      userId: z.string(),
    })
    .superRefine(async (input, ctx) => {
      const { projectId, userId } = input;

      const projectMember = await db
        .select({
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, userId),
          ),
        )
        .then((x) => x[0]!);

      if (projectMember.count === 0) {
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
