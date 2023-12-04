"use server";

import { and, db, drizzleDb, eq, exists, schema } from "@acme/db";

import { getCurrentUser } from "./get-user";

export async function getPosts(
  projectId: string,
  pagination: { page: number; pageSize: number },
  filter?: string,
) {
  const user = await getCurrentUser();

  const data = await db.post.findMany({
    where: {
      projectId,
      project: {
        deletedAt: null,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      OR: filter
        ? [
            {
              title: {
                contains: filter,
              },
            },
            {
              slug: {
                contains: filter,
              },
            },
          ]
        : undefined,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      hidden: true,
      _count: {
        select: {
          visits: true,
        },
      },
    },
    take: pagination.pageSize,
    skip: pagination.pageSize * pagination.page - pagination.pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });

  const count = await db.post.count({
    where: {
      projectId,
      project: {
        deletedAt: null,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      OR: filter
        ? [
            {
              title: {
                contains: filter,
              },
            },
            {
              slug: {
                contains: filter,
              },
            },
          ]
        : undefined,
    },
  });

  return {
    data,
    count,
  };
}

export type GetPosts = Awaited<ReturnType<typeof getPosts>>;

export async function getPost(projectId: string, postId: string) {
  const user = await getCurrentUser();

  return await drizzleDb.query.posts.findFirst({
    where: and(
      eq(schema.posts.projectId, projectId),
      eq(schema.posts.id, postId),
      exists(
        drizzleDb
          .select()
          .from(schema.projectMembers)
          .where(
            and(
              eq(schema.projectMembers.projectId, schema.posts.projectId),
              eq(schema.projectMembers.userId, user.id),
            ),
          ),
      ),
    ),
    columns: {
      id: true,
      projectId: true,
      title: true,
      description: true,
      slug: true,
      createdAt: true,
      hidden: true,
      content: true,
      thumbnailUrl: true,
      seoTitle: true,
      seoDescription: true,
    },
    with: {
      project: {
        columns: {
          name: true,
          domain: true,
        },
      },
    },
  });
}

export type GetPost = Awaited<ReturnType<typeof getPost>>;
