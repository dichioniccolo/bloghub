"use server";

import { z } from "zod";

import { deleteUnusedMediaInPost } from "@acme/common/actions";
import { prisma } from "@acme/db";

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

      const count = await prisma.project.count({
        where: {
          id: projectId,
          users: {
            some: {
              userId,
            },
          },
        },
      });

      if (count === 0) {
        ctx.addIssue({
          code: "custom",
          message: "You must be a member of the project",
          path: ["projectId"],
        });
      }

      const postCount = await prisma.post.count({
        where: {
          id: postId,
          projectId,
        },
      });

      if (postCount === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Post not found",
          path: ["postId"],
        });
      }
    }),
)(async ({ postId, body }) => {
  const post = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      title: body.title,
      description: body.description,
      content: body.content,
    },
  });

  await deleteUnusedMediaInPost(post.id);

  return post;
});
