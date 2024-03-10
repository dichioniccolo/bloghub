"use server";

import type { Prisma } from "@acme/db";
import { prisma } from "@acme/db";

import { getCurrentUser } from "./get-user";

export async function getPosts(
  projectId: string,
  pagination: { page: number; pageSize: number },
  filter?: string,
) {
  const user = await getCurrentUser();

  const where: Prisma.PostsWhereInput = {
    projectId,
    project: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    ...(filter
      ? {
          title: {
            contains: filter,
          },
        }
      : {}),
  };

  const data = await prisma.posts.findMany({
    where,
    select: {
      id: true,
      title: true,
      createdAt: true,
      hidden: true,
      _count: {
        select: {
          visits: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pagination.pageSize,
    skip: pagination.pageSize * pagination.page - pagination.pageSize,
  });

  const count = await prisma.posts.count({
    where,
  });

  return {
    data,
    count,
  };
}

export type GetPosts = Awaited<ReturnType<typeof getPosts>>;

export async function getPost(projectId: string, postId: string) {
  const user = await getCurrentUser();

  return prisma.posts.findFirst({
    where: {
      projectId,
      id: postId,
      project: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    select: {
      id: true,
      projectId: true,
      title: true,
      description: true,
      createdAt: true,
      hidden: true,
      content: true,
      thumbnailUrl: true,
      seoTitle: true,
      seoDescription: true,
      project: {
        select: {
          name: true,
          domain: true,
        },
      },
    },
  });
}

export type GetPost = Awaited<ReturnType<typeof getPost>>;
