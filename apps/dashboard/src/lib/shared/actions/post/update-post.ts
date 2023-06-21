"use server";

import { z } from "zod";

import { deleteUnusedMediaInPost } from "@acme/common/actions";
import { and, db, eq, posts, projectMembers, projects, sql } from "@acme/db";
import { zact } from "@acme/zact/server";

export const updatePost = zact(
  z
    .object({
      userId: z.string().nonempty(),
      projectId: z.string().nonempty(),
      postId: z.string().nonempty(),
      body: z.object({
        title: z.string(),
        content: z.any(),
      }),
    })
    .superRefine(async ({ postId, projectId, userId }, ctx) => {
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
)(async ({ postId, body: { title, content } }) => {
  const post = await db
    .update(posts)
    .set({
      title,
      description: "",
      content,
    })
    .where(eq(posts.id, postId))
    .returning({
      id: posts.id,
    })
    .then((x) => x[0]!);

  await deleteUnusedMediaInPost(post.id);

  return post;
});
