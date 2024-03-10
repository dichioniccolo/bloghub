"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_MEMBER_MESSAGE, isProjectMember } from "../schemas";

export const updatePostSettings = createServerAction({
  actionName: "updatePostSettings",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: z.string().min(1),
    postId: z.string().min(1),
    data: z.object({
      thumbnailUrl: z.string().url().optional().nullable(),
      seoTitle: z.string().optional().nullable(),
      seoDescription: z.string().optional().nullable(),
    }),
  }),
  action: async ({
    input: {
      projectId,
      postId,
      data: { thumbnailUrl, seoTitle, seoDescription },
    },
    ctx: { user },
  }) => {
    if (!(await isProjectMember(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_MEMBER_MESSAGE);
    }

    await prisma.posts.update({
      where: {
        id: postId,
        projectId,
      },
      data: {
        thumbnailUrl,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        seoTitle: seoTitle || null,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        seoDescription: seoDescription || null,
        hidden: false,
      },
    });

    revalidatePath(AppRoutes.PostEditor(projectId, postId));
  },
});
