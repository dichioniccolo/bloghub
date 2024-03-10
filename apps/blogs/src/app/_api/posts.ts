"use server";

import { Prisma, prisma } from "@acme/db";

interface PostsPaginationOptions {
  offset?: number;
  limit?: number;
}

export async function getPosts(
  projectId: string,
  { offset = 0, limit = 3 }: PostsPaginationOptions,
) {
  return await prisma.posts.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailUrl: true,
      _count: {
        select: {
          visits: true,
        },
      },
    },
    where: {
      hidden: false,
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: offset,
    take: limit,
  });
}

export async function getPostById(domain: string, postId: string) {
  return await prisma.posts.findFirst({
    where: {
      id: postId,
      hidden: false,
      project: {
        domain,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailUrl: true,
      content: true,
      seoTitle: true,
      seoDescription: true,
      createdAt: true,
      project: {
        select: {
          name: true,
          logo: true,
          domain: true,
        },
      },
    },
  });
}

export async function getRandomPostsByDomain(
  domain: string,
  postId: string,
  toGenerate = 3,
) {
  const ids = await prisma.$queryRaw<{ id: string }[]>(
    Prisma.sql`
      SELECT "id"
      FROM "Posts"
      WHERE "hidden" = false
      AND "id" != ${postId}
      AND EXISTS (
      SELECT 1
      FROM "Projects"
      WHERE "id" = "Posts"."projectId"
      AND "domain" = ${domain}
      )
      ORDER BY random()
      LIMIT ${toGenerate}
    `,
  );

  if (ids.length === 0) {
    return [];
  }

  return await prisma.posts.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailUrl: true,
      createdAt: true,
    },
    where: {
      id: {
        in: ids.map((x) => x.id),
      },
    },
  });
}

export type GetRandomPostsByDomain = Awaited<
  ReturnType<typeof getRandomPostsByDomain>
>;
