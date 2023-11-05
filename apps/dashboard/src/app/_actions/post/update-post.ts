"use server";

import { z } from "zod";

import { db } from "@acme/db";

import { authenticatedAction } from "../authenticated-action";
import { isProjectMember } from "../schemas";

export const updatePost = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      postId: z.string().min(1),
      body: z.object({
        title: z.string(),
        description: z.string().optional().nullable(),
        content: z.string().min(1),
      }),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isProjectMember(projectId, userId, ctx);
    }),
)(async ({ projectId, postId, body: { title, description, content } }) => {
  const postContent = Buffer.from(content, "base64").toString("utf-8");

  const post = await db.post.update({
    where: {
      id: postId,
      projectId,
    },
    data: {
      title,
      description,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      content: JSON.parse(postContent),
    },
    select: {
      id: true,
    },
  });

  return post;
});
