"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";

import { authenticatedAction } from "../authenticated-action";
import { isProjectMember } from "../schemas";

export const deletePost = authenticatedAction(({ userId }) =>
  z
    .object({
      postId: z.string().min(1),
      projectId: z.string().min(1),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isProjectMember(projectId, userId, ctx);
    }),
)(async ({ projectId, postId }, { userId }) => {
  await db.post.delete({
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
  });

  revalidatePath(AppRoutes.ProjectDashboard(projectId));
});
