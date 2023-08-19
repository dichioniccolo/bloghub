"use server";

import type { JSONContent } from "@tiptap/core";
import { z } from "zod";

import { and, db, eq, posts, projectMembers, projects, sql } from "@acme/db";

import { $getUser } from "~/app/_api/get-user";
import { inngest } from "~/lib/inngest";
import { zactAuthenticated } from "~/lib/zact/server";

export const updatePost = zactAuthenticated(
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
        body: z.object({
          title: z.string(),
          description: z.string().optional().nullable(),
          content: z.string(),
        }),
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
            message:
              "You must be a member of the project to perform this action",
            path: ["projectId"],
          });
        }
      }),
)(async ({ postId, body: { title, description, content } }) => {
  await db
    .update(posts)
    .set({
      title,
      description,
      content: JSON.parse(content) as JSONContent,
    })
    .where(eq(posts.id, postId));

  const post = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(eq(posts.id, postId))
    .then((x) => x[0]!);

  await inngest.send({
    name: "post/update",
    data: {
      id: postId,
    },
  });

  return post;
});
