"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";

import { authenticatedAction } from "../authenticated-action";
import { isProjectMember } from "../schemas";

// TODO: handle better with seo, thumbnail, etc
export const togglePublishedPost = authenticatedAction(({ userId }) =>
  z
    .object({
      postId: z.string().min(1),
      projectId: z.string().min(1),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isProjectMember(projectId, userId, ctx);
    }),
)(async ({ projectId, postId }, { userId }) => {
  const post = await db.post.findFirstOrThrow({
    where: {
      projectId,
      id: postId,
      project: {
        deletedAt: null,
        members: {
          some: {
            userId,
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
});
