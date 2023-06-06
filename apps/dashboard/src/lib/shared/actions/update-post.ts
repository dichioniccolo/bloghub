"use server";

import { z } from "zod";

import { deleteUnusedMediaInPost } from "@acme/common/actions";
import { and, db, eq, posts, projectMembers, projects, sql } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const updatePost = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
      postId: z.string(),
      body: z.object({
        title: z.string().min(3).max(128),
        description: z.string().optional(),
        content: z.string(),
      }),
    })
    .superRefine(async (input, ctx) => {
      const { projectId, userId, postId } = input;

      const projectsCount = await db
        .select({
          count: sql<number>`count(${projects.id})`.mapWith(Number),
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

      if (projectsCount.count === 0) {
        ctx.addIssue({
          code: "custom",
          message: "You must be a member of the project",
          path: ["projectId"],
        });
      }

      const postCount = await db
        .select({
          count: sql<number>`count(${posts.id})`.mapWith(Number),
        })
        .from(posts)
        .where(and(eq(posts.id, postId), eq(posts.projectId, projectId)))
        .then((x) => x[0]!);

      if (postCount.count === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Post not found",
          path: ["postId"],
        });
      }
    }),
)(async ({ postId, body }) => {
  const post = await db
    .update(posts)
    .set({
      title: body.title,
      description: body.description,
      content: body.content,
    })
    .where(eq(posts.id, postId))
    .returning({
      id: posts.id,
    })
    .then((x) => x[0]!);

  await deleteUnusedMediaInPost(post.id);

  return post;
});
