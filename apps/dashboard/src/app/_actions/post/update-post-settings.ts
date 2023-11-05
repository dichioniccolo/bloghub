"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";

import { authenticatedAction } from "../authenticated-action";
import { isProjectMember } from "../schemas";

export const updatePostSettings = authenticatedAction(({ userId }) =>
  z
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
      await isProjectMember(projectId, userId, ctx);

      const count = await db.post.count({
        where: {
          slug,
          projectId,
          id: {
            not: postId,
          },
        },
      });

      if (count > 0) {
        ctx.addIssue({
          code: "custom",
          message: "A post with the same slug already exists",
          path: ["slug"],
        });
      }
    }),
)(async ({
  projectId,
  postId,
  data: { slug, thumbnailUrl, seoTitle, seoDescription },
}) => {
  await db.post.update({
    where: {
      id: postId,
      projectId,
    },
    data: {
      slug,
      thumbnailUrl,
      seoTitle,
      seoDescription,
      hidden: false,
    },
  });

  revalidatePath(AppRoutes.PostEditor(projectId, postId));
});
