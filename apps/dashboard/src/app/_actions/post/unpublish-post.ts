"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_MEMBER_MESSAGE, isProjectMember } from "../schemas";

export const unpublishPost = createServerAction({
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    postId: RequiredString,
    projectId: RequiredString,
  }),
  action: async ({ input: { projectId, postId }, ctx: { user } }) => {
    if (!(await isProjectMember(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_MEMBER_MESSAGE);
    }

    const post = await db.post.findFirstOrThrow({
      where: {
        projectId,
        id: postId,
        project: {
          deletedAt: null,
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      select: {
        id: true,
        hidden: true,
      },
    });

    await db.post.update({
      where: {
        id: post.id,
      },
      data: {
        hidden: !post.hidden,
      },
    });

    revalidatePath(AppRoutes.PostEditor(projectId, postId));
  },
});
