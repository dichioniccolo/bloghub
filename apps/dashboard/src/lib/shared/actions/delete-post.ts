"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const deletePost = zact(
  z.object({
    userId: z.string(),
    postId: z.string(),
    projectId: z.string(),
  }),
)(async ({ userId, projectId, postId }) => {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      project: {
        id: projectId,
        users: {
          some: {
            userId,
          },
        },
      },
    },
    select: {
      id: true,
      project: {
        select: {
          users: {
            select: {
              role: true,
            },
            where: {
              userId,
            },
          },
        },
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.project.users[0]?.role !== "OWNER") {
    throw new Error("You must be the owner of the project");
  }

  // TODO: Delete medias for this post
  // TODO: delete post on redis (do we still need this?)
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  revalidatePath(`/projects/${projectId}`);
});
