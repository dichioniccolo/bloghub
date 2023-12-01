"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_MEMBER_MESSAGE, isProjectMember } from "../schemas";

export const updatePostSettings = createServerAction({
  actionName: "updatePostSettings",
  middlewares: authenticatedMiddlewares,
  schema: z
    .object({
      projectId: z.string().min(1),
      postId: z.string().min(1),
      data: z.object({
        slug: z
          .string()
          .min(1)
          .regex(/^[a-z0-9-]+$/i),
        thumbnailUrl: z.string().url().optional().nullable(),
        seoTitle: z.string().optional().nullable(),
        seoDescription: z.string().optional().nullable(),
      }),
    })
    .superRefine(async ({ projectId, postId, data: { slug } }, ctx) => {
      const postWithSameSlugExists = await db.post.exists({
        where: {
          slug,
          projectId,
          id: {
            not: postId,
          },
        },
      });

      if (postWithSameSlugExists) {
        ctx.addIssue({
          code: "custom",
          message: "A post with the same slug already exists",
          path: ["slug"],
        });
      }
    }),
  action: async ({
    input: {
      projectId,
      postId,
      data: { slug, thumbnailUrl, seoTitle, seoDescription },
    },
    ctx: { user },
  }) => {
    if (!(await isProjectMember(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_MEMBER_MESSAGE);
    }

    await db.post.update({
      where: {
        id: postId,
        projectId,
      },
      data: {
        slug,
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
