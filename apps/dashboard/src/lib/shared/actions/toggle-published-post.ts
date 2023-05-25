"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const togglePublishedPost = zact(
  z
    .object({
      postId: z.string().refine(async (postId) => {
        const count = await prisma.post.count({
          where: {
            id: postId,
          },
        });

        return count === 1;
      }, "Post does not exist"),
      projectId: z.string(),
      userId: z.string(),
    })
    .superRefine(async (input, ctx) => {
      const { projectId, userId } = input;

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
    }),
)(async ({ projectId, postId }) => {
  const { hidden } = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      hidden: !hidden,
    },
  });

  revalidatePath(`/projects/${projectId}`);
});
