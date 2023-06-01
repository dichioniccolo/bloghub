"use server";

import { prisma } from "@acme/db";

import { $getUser } from "../get-user";

export async function getPosts(projectId: string) {
  const user = await $getUser();

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
      hidden: true,
      _count: {
        select: {
          visit: true,
        },
      },
    },
  });

  return posts;
}

export type GetPosts = Awaited<ReturnType<typeof getPosts>>;

export async function getPost(projectId: string, postId: string) {
  const user = await $getUser();

  const post = await prisma.post.findFirst({
    where: {
      id: postId,
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
      content: true,
      projectId: true,
      hidden: true,
    },
  });

  return post;
}

export type GetPost = Awaited<ReturnType<typeof getPost>>;
