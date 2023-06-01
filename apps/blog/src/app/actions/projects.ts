"use server";

import { prisma, type Prisma } from "@acme/db";

const skip = (page: number, perPage: number) => (page - 1) * perPage;
const take = (perPage: number) => perPage;

export async function getProjectByDomain(
  domain: string,
  page = 1,
  perPage = 20,
) {
  const project = await prisma.project.findUnique({
    where: {
      domain,
    },
    select: {
      name: true,
    },
  });

  if (!project) {
    return {
      project: null,
      posts: null,
      postsCount: 0,
    };
  }

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

  return { project, posts, postsCount };
}

export type GetProjectByDomain = Awaited<ReturnType<typeof getProjectByDomain>>;

export type GetPostsProjectByDomain = NonNullable<GetProjectByDomain["posts"]>;
