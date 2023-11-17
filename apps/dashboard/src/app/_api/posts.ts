"use server";

import { db } from "@acme/db";
import { SELF_REFERER } from "@acme/lib/constants";

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

  return await db.post.findFirst({
    where: {
      projectId,
      id: postId,
      project: {
        deletedAt: null,
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
      slug: true,
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

export async function getPostAnalytics(projectId: string, postId: string) {
  const user = await getCurrentUser();

  const allVisits = await db.visit.findMany({
    where: {
      projectId,
      postId,
      project: {
        deletedAt: null,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    select: {
      createdAt: true,
      postId: true,
      geoCountry: true,
      geoCity: true,
      referer: true,
      post: {
        select: {
          slug: true,
        },
      },
    },
  });
  const visitsByMonth = allVisits
    .reduce(
      (prev, x) => {
        const year = x.createdAt.getFullYear();
        const month = x.createdAt.getMonth() + 1;
        const existingMonth = prev.find(
          (z) => z.year === year && z.month === month,
        );

        if (existingMonth) {
          existingMonth.count += 1;
        } else {
          prev.push({ year, month, count: 1 });
        }

        return prev;
      },
      [] as { year: number; month: number; count: number }[],
    )
    // Sort the result by year and month
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

  const topPosts = allVisits
    .reduce(
      (prev, x) => {
        const existingPost = prev.find((z) => z.id === (x.postId ?? "DELETED"));

        if (existingPost) {
          existingPost.count += 1;
        } else {
          prev.push({
            id: x.postId ?? "DELETED",
            slug: x.post?.slug ?? "DELETED",
            count: 1,
          });
        }

        return prev;
      },
      [] as {
        id: string;
        slug: string;
        count: number;
      }[],
    )
    .sort((a, b) => a.count - b.count);

  const topCountries = allVisits
    .reduce(
      (prev, x) => {
        const existingPost = prev.find(
          (z) => z.country === (x.geoCountry ?? "Unknown"),
        );

        if (existingPost) {
          existingPost.count += 1;
        } else {
          prev.push({
            country: x.geoCountry ?? "Unknown",
            count: 1,
          });
        }

        return prev;
      },
      [] as {
        country: string;
        count: number;
      }[],
    )
    .sort((a, b) => a.count - b.count);

  const topCities = allVisits
    .reduce(
      (prev, x) => {
        const existingPost = prev.find(
          (z) =>
            z.country === (x.geoCountry ?? "Unknown") &&
            z.city === (x.geoCity ?? "Unknown"),
        );

        if (existingPost) {
          existingPost.count += 1;
        } else {
          prev.push({
            country: x.geoCountry ?? "Unknown",
            city: x.geoCity ?? "Unknown",
            count: 1,
          });
        }

        return prev;
      },
      [] as {
        country: string;
        city: string;
        count: number;
      }[],
    )
    .sort((a, b) => a.count - b.count);

  const topReferers = allVisits
    .reduce(
      (prev, x) => {
        const existingPost = prev.find(
          (z) => z.country === (x.referer ?? SELF_REFERER),
        );

        if (existingPost) {
          existingPost.count += 1;
        } else {
          prev.push({
            country: x.referer ?? SELF_REFERER,
            count: 1,
          });
        }

        return prev;
      },
      [] as {
        country: string;
        count: number;
      }[],
    )
    .sort((a, b) => a.count - b.count);

  return {
    visitsByMonth,
    topPosts,
    topCountries,
    topCities,
    topReferers,
  };
}

export type GetPostAnalytics = Awaited<ReturnType<typeof getPostAnalytics>>;
