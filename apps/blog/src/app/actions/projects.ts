"use server";

import { prisma } from "@acme/db";

const POSTS_PER_PAGE = 20;

const skip = (page: number) => (page - 1) * POSTS_PER_PAGE;
const take = POSTS_PER_PAGE + 1;

export async function getProjectByDomain(domain: string, page = 1) {
  const project = await prisma.project.findUnique({
    where: {
      domain,
    },
    select: {
      name: true,
      // users: {
      //   where: {
      //     role: Role.OWNER,
      //   },
      //   take: 1,
      //   select: {
      //     user: {
      //       select: {
      //         name: true,
      //       }
      //     }
      //   }
      // },
      posts: {
        skip: skip(page),
        take,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          hidden: false,
        },
        select: {
          id: true,
          slug: true,
          title: true,
          contentHtml: true,
          likes: true,
          createdAt: true,
        },
      },
    },
  });

  return {
    project: project
      ? {
          ...project,
          posts: project.posts.filter((_, i) => i < POSTS_PER_PAGE),
        }
      : null,
    hasMorePages: project?.posts.length === take - 1,
  };
}

export type GetProjectByDomain = Awaited<ReturnType<typeof getProjectByDomain>>;

export type GetPostsProjectByDomain = NonNullable<
  GetProjectByDomain["project"]
>["posts"];
