"use server";

import { db, Role } from "@acme/db";
import {
  isSubscriptionPlanPro,
  stripePriceToSubscriptionPlan,
} from "@acme/stripe/plans";

import { getCurrentUser } from "./get-user";
import { getUserTotalUsage } from "./get-user-total-usage";
import { getBillingPeriod } from "./user";

export async function getProjects() {
  const user = await getCurrentUser();

  return await db.project.findMany({
    where: {
      deletedAt: null,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      logo: true,
      domain: true,
      domainVerified: true,
      members: {
        where: {
          userId: user.id,
        },
      },
      _count: {
        select: {
          posts: true,
          visits: true,
        },
      },
    },
  });
}
export type GetProjects = Awaited<ReturnType<typeof getProjects>>;

export async function getProject(id: string) {
  const user = await getCurrentUser();

  return await db.project.findUnique({
    where: {
      id,
      deletedAt: null,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      logo: true,
      domain: true,
      domainVerified: true,
      members: {
        where: {
          userId: user.id,
        },
      },
    },
  });
}

export type GetProject = Awaited<ReturnType<typeof getProject>>;

// We need to show only projects where the user is the owner
export async function getProjectsCount() {
  const user = await getCurrentUser();

  const count = await db.project.count({
    where: {
      deletedAt: null,
      members: {
        some: {
          userId: user.id,
          roleEnum: Role.OWNER,
        },
      },
    },
  });

  return count;
}

export async function getProjectUsers(projectId: string) {
  const user = await getCurrentUser();

  return await db.projectMember.findMany({
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
    },
    select: {
      roleEnum: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

export type GetProjectUsers = Awaited<ReturnType<typeof getProjectUsers>>;

export async function getProjectInvites(projectId: string) {
  const user = await getCurrentUser();

  return await db.projectInvitation.findMany({
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
    },
    select: {
      email: true,
      createdAt: true,
      expiresAt: true,
    },
  });
}

export type GetProjectInvites = Awaited<ReturnType<typeof getProjectInvites>>;

export async function getProjectOwner(projectId: string) {
  const user = await getCurrentUser();

  const owner = await db.user.findFirstOrThrow({
    where: {
      projects: {
        some: {
          projectId,
          roleEnum: Role.OWNER,
        },
      },
    },
    select: {
      stripePriceId: true,
      dayWhenBillingStarts: true,
    },
  });

  const billingPeriod = await getBillingPeriod(owner.dayWhenBillingStarts);

  const usage = await getUserTotalUsage(
    user.id,
    billingPeriod[0],
    billingPeriod[1],
  );

  const plan = stripePriceToSubscriptionPlan(owner.stripePriceId);

  return {
    usage,
    quota: plan.quota,
    isPro: isSubscriptionPlanPro(plan),
  };
}

export type GetProjectOwner = Awaited<ReturnType<typeof getProjectOwner>>;

export async function getPendingInvite(email: string, projectId: string) {
  return await db.projectInvitation.findUnique({
    where: {
      email_projectId: {
        email,
        projectId,
      },
    },
    select: {
      expiresAt: true,
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export type GetPendingInvite = Awaited<ReturnType<typeof getPendingInvite>>;

export async function getProjectAnalytics(projectId: string) {
  const user = await getCurrentUser();

  const allVisits = await db.visit.findMany({
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
          (z) => z.referer === (x.referer ?? "SELF"),
        );

        if (existingPost) {
          existingPost.count += 1;
        } else {
          prev.push({
            referer: x.referer ?? "SELF",
            count: 1,
          });
        }

        return prev;
      },
      [] as {
        referer: string;
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

export type GetProjectAnalytics = Awaited<
  ReturnType<typeof getProjectAnalytics>
>;

export async function getCurrentUserRole(projectId: string) {
  const user = await getCurrentUser();

  const projectMember = await db.projectMember.findUniqueOrThrow({
    where: {
      projectId_userId: {
        projectId,
        userId: user.id,
      },
    },
    select: {
      roleEnum: true,
    },
  });

  return projectMember.roleEnum!;
}
