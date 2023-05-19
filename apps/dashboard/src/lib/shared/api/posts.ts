"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";
import { prisma } from "@acme/db";

export async function getPosts(projectId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be authenticated");
  }

  const { user } = session;

  const posts = await prisma.post.findMany({
    where: {
      projectId,
      project: {
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      clicks: true,
      published: true,
    },
  });

  return posts;
}

export type GetPosts = Awaited<ReturnType<typeof getPosts>>;
