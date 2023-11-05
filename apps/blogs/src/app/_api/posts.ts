"use server";

import { db } from "@acme/db";
import { generateRandomIndices } from "@acme/lib/utils";

const skip = (page: number, perPage: number) => (page - 1) * perPage;
const take = (perPage: number) => perPage;

export async function getMainPagePostsByDomain(
  domain: string,
  page = 1,
  perPage = 100,
) {
  const posts = await db.post.findMany({
    where: {
      hidden: false,
      project: {
        deletedAt: null,
        domain,
      },
    },
    skip: skip(page, perPage),
    take: take(perPage),
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      thumbnailUrl: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  const postsCount = await db.post.count({
    where: {
      hidden: false,
      project: {
        deletedAt: null,
        domain,
      },
    },
  });

  return { posts, postsCount: postsCount };
}
export type GetPostsProjectByDomain = Awaited<
  ReturnType<typeof getMainPagePostsByDomain>
>["posts"];

export async function getPostBySlug(domain: string, slug: string) {
  return await db.post.findFirst({
    where: {
      hidden: false,
      project: {
        deletedAt: null,
        domain,
      },
      slug,
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
  currentPostSlug: string,
  toGenerate = 3,
) {
  const posts = await db.post.findMany({
    where: {
      hidden: false,
      slug: {
        not: currentPostSlug,
      },
      project: {
        deletedAt: null,
        domain,
      },
    },
    select: {
      id: true,
    },
  });

  const postIds = posts.map((post) => post.id);

  const randomIndices = generateRandomIndices(postIds.length, toGenerate);

  const ids = randomIndices.map((index) => postIds[index]!).filter(Boolean);

  if (ids.length === 0) {
    return [];
  }

  return await db.post.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      thumbnailUrl: true,
      createdAt: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
}

export type GetRandomPostsByDomain = Awaited<
  ReturnType<typeof getRandomPostsByDomain>
>;
