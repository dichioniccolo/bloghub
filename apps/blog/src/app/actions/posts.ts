"use server";

import { prisma, type Prisma } from "@acme/db";

import { generateRandomIndices } from "~/lib/utils";

const skip = (page: number, perPage: number) => (page - 1) * perPage;
const take = (perPage: number) => perPage;

export async function getPostsByDomain(domain: string, page = 1, perPage = 20) {
  const postsWhere = {
    hidden: false,
  } satisfies Prisma.PostSelect;

  const [posts, postsCount] = await Promise.all([
    prisma.post.findMany({
      skip: skip(page, perPage),
      take: take(perPage),
      orderBy: {
        createdAt: "desc",
      },
      where: postsWhere,
      select: {
        id: true,
        slug: true,
        title: true,
        contentHtml: true,
        createdAt: true,
        _count: {
          select: {
            likedBy: true,
          },
        },
      },
    }),
    prisma.post.count({
      where: postsWhere,
    }),
  ]);

  return { posts, postsCount };
}
export type GetPostsProjectByDomain = Awaited<
  ReturnType<typeof getPostsByDomain>
>["posts"];

export async function getPostBySlug(domain: string, slug: string) {
  return await prisma.post.findFirst({
    where: {
      slug,
      project: {
        domain,
      },
    },
    select: {
      id: true,
      title: true,
      contentHtml: true,
      createdAt: true,
      project: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });
}

export async function getRandomPostsByDomain(
  domain: string,
  currentPostId: string,
) {
  const posts = await prisma.post.findMany({
    where: {
      project: {
        domain,
      },
      NOT: {
        id: currentPostId,
      },
    },
    select: {
      id: true,
    },
  });

  const postIds = posts.map((post) => post.id);

  const randomIndices = generateRandomIndices(postIds.length, 3);

  const ids = randomIndices.map((index) => postIds[index]).filter(Boolean);

  const selectedPosts = await prisma.post.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      contentHtml: true,
      createdAt: true,
      _count: {
        select: {
          likedBy: true,
        },
      },
    },
  });

  return selectedPosts;
}
