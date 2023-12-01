"use server";

import { z } from "zod";

import type { Post } from "@acme/db";
import { db } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_MEMBER_MESSAGE, isProjectMember } from "../schemas";

export const updatePost = createServerAction({
  actionName: "updatePost",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: RequiredString,
    postId: RequiredString,
    body: z.object({
      title: RequiredString,
      description: z.string().optional().nullable(),
      content: RequiredString,
    }),
  }),
  initialState: undefined as unknown as Pick<Post, "id">,
  action: async ({
    input: {
      projectId,
      postId,
      body: { title, description, content },
    },
    ctx: { user },
  }) => {
    if (!(await isProjectMember(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_MEMBER_MESSAGE);
    }

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
  },
});
