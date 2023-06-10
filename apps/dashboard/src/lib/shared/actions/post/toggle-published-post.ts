"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AppRoutes } from "@acme/common/routes";
import { and, db, eq, posts, projectMembers, projects, sql } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const togglePublishedPost = zact(
  z
    .object({
      postId: z.string().nonempty(),
      projectId: z.string().nonempty(),
      userId: z.string().nonempty(),
    })
    .superRefine(async ({ userId, postId, projectId }, ctx) => {
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
