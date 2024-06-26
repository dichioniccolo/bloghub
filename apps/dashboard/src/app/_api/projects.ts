"use server";

import { format } from "date-fns";

import type { Prisma } from "@acme/db";
import { prisma } from "@acme/db";
import { UNKNOWN_ANALYTICS_VALUE } from "@acme/lib/constants";
import type { AnalyticsInterval } from "@acme/lib/utils";
import {
  generatePostSlug,
  getPostIdFromSlug,
  intervalsFilters,
  roundDateToInterval,
} from "@acme/lib/utils";
import {
  isSubscriptionPlanPro,
  stripePriceToSubscriptionPlan,
} from "@acme/stripe/plans";

import { getCurrentUser } from "./get-user";
import { getUserTotalUsage } from "./get-user-total-usage";
import { getBillingPeriod } from "./user";

export async function getProjects() {
  const user = await getCurrentUser();

  return await prisma.projects.findMany({
    where: {
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

  return await prisma.projects.findFirst({
    where: {
      id,
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

  const projectsCount = await prisma.projects.count({
    where: {
      members: {
        some: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  return projectsCount;
}

export async function getProjectUsers(projectId: string) {
  const user = await getCurrentUser();

  return await prisma.projectMembers.findMany({
    where: {
      projectId,
      userId: user.id,
    },
    select: {
      role: true,
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

  return await prisma.projectInvitations.findMany({
    where: {
      projectId,
      project: {
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

  const owner = await prisma.user.findFirst({
    where: {
      memberOfProjects: {
        some: {
          projectId,
          role: "OWNER",
        },
      },
    },
    select: {
      id: true,
      stripePriceId: true,
      dayWhenBillingStarts: true,
    },
  });

  if (!owner) {
    throw new Error("Owner not found");
  }

  const billingPeriod = await getBillingPeriod(owner.dayWhenBillingStarts);

  const usage = await getUserTotalUsage(
    user.id,
    billingPeriod[0],
    billingPeriod[1],
  );

  const plan = stripePriceToSubscriptionPlan(owner.stripePriceId);

  return {
    id: owner.id,
    usage,
    quota: plan.quota,
    isPro: isSubscriptionPlanPro(plan),
  };
}

export type GetProjectOwner = Awaited<ReturnType<typeof getProjectOwner>>;

export async function getPendingInvite(email: string, projectId: string) {
  return await prisma.projectInvitations.findFirst({
    where: {
      email,
      projectId,
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

export async function getProjectAnalytics(
  projectId: string,
  filters: {
    interval: AnalyticsInterval;
    country: string | null;
    city: string | null;
    slug: string | null;
    referer: string | null;
    device: string | null;
    browser: string | null;
    os: string | null;
  },
) {
  const user = await getCurrentUser();

  const intervalFilter = intervalsFilters[filters.interval];

  const where: Prisma.VisitsWhereInput = {
    ...(intervalFilter.createdAt
      ? {
          createdAt: {
            gte: intervalFilter.createdAt,
          },
        }
      : {}),
    ...(filters.country ? { geoCountry: filters.country } : {}),
    ...(filters.city ? { geoCity: filters.city } : {}),
    ...(filters.slug ? { postId: getPostIdFromSlug(filters.slug) } : {}),
    ...(filters.referer ? { referer: filters.referer } : {}),
    ...(filters.device ? { deviceType: filters.device } : {}),
    ...(filters.browser ? { browserName: filters.browser } : {}),
    ...(filters.os ? { osName: filters.os } : {}),
  };

  const allVisits = await prisma.visits.findMany({
    where: {
      projectId,
      project: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      ...where,
    },
    select: {
      geoCountry: true,
      geoCity: true,
      deviceType: true,
      browserName: true,
      osName: true,
      referer: true,
      createdAt: true,
      project: {
        select: {
          domain: true,
        },
      },
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  // calculate timeseries based on interval
  const groupedVisits = allVisits.reduce(
    (result, visit) => {
      const roundedCreatedAt = roundDateToInterval(
        visit.createdAt,
        filters.interval,
      );

      const key = `${format(roundedCreatedAt, "yyyy-MM-dd HH:mm:ss")}`;

      if (!result[key]) {
        result[key] = {
          createdAt: roundedCreatedAt,
          count: 0,
        };
      }

      result[key]!.count += 1;

      return result;
    },
    {} as Record<string, { createdAt: Date; count: number }>,
  );

  const timeseries = Object.values(groupedVisits);

  timeseries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const groupedCities = allVisits.reduce(
    (result, visit) => {
      const key = `${visit.geoCountry ?? UNKNOWN_ANALYTICS_VALUE}_${
        visit.geoCity ?? UNKNOWN_ANALYTICS_VALUE
      }`;

      if (!result[key]) {
        result[key] = {
          country: visit.geoCountry ?? UNKNOWN_ANALYTICS_VALUE,
          city: visit.geoCity ?? UNKNOWN_ANALYTICS_VALUE,
          count: 0,
        };
      }

      result[key]!.count += 1;

      return result;
    },
    {} as Record<
      string,
      {
        country: string;
        city: string;
        count: number;
      }
    >,
  );

  const cities = Object.values(groupedCities).sort((a, b) => b.count - a.count);

  const groupedCountries = cities.reduce(
    (result, city) => {
      if (!result[city.country]) {
        result[city.country] = {
          country: city.country,
          count: 0,
        };
      }

      result[city.country]!.count += city.count;

      return result;
    },
    {} as Record<string, { country: string; count: number }>,
  );

  const countries = Object.values(groupedCountries).sort(
    (a, b) => b.count - a.count,
  );

  const groupedPosts = allVisits.reduce(
    (result, visit) => {
      const slug = visit.post
        ? generatePostSlug(visit.post.title, visit.post.id)
        : "DELETED";

      if (!result[slug]) {
        result[slug] = {
          domain: visit.project.domain,
          slug,
          count: 0,
        };
      }

      result[slug]!.count += 1;

      return result;
    },
    {} as Record<string, { domain: string; slug: string; count: number }>,
  );

  const posts = Object.values(groupedPosts).sort((a, b) => b.count - a.count);

  const groupedReferers = allVisits.reduce(
    (result, visit) => {
      const referer = visit.referer ?? UNKNOWN_ANALYTICS_VALUE;

      if (!result[referer]) {
        result[referer] = {
          referer: referer,
          count: 0,
        };
      }

      result[referer]!.count += 1;

      return result;
    },
    {} as Record<string, { referer: string; count: number }>,
  );

  const referers = Object.values(groupedReferers).sort(
    (a, b) => b.count - a.count,
  );

  const groupedDevices = allVisits.reduce(
    (result, visit) => {
      const key = visit.deviceType ?? "desktop";

      if (!result[key]) {
        result[key] = {
          device: key,
          count: 0,
        };
      }

      result[key]!.count += 1;

      return result;
    },
    {} as Record<string, { device: string; count: number }>,
  );

  const devices = Object.values(groupedDevices).sort(
    (a, b) => b.count - a.count,
  );

  const groupedBrowsers = allVisits.reduce(
    (result, visit) => {
      const key = visit.browserName ?? UNKNOWN_ANALYTICS_VALUE;

      if (!result[key]) {
        result[key] = {
          browser: key,
          count: 0,
        };
      }

      result[key]!.count += 1;

      return result;
    },
    {} as Record<string, { browser: string; count: number }>,
  );

  const browsers = Object.values(groupedBrowsers).sort(
    (a, b) => b.count - a.count,
  );

  const groupedOses = allVisits.reduce(
    (result, visit) => {
      const key = visit.osName ?? UNKNOWN_ANALYTICS_VALUE;

      if (!result[key]) {
        result[key] = {
          os: key,
          count: 0,
        };
      }

      result[key]!.count += 1;

      return result;
    },
    {} as Record<string, { os: string; count: number }>,
  );

  const oses = Object.values(groupedOses).sort((a, b) => b.count - a.count);

  return {
    timeseries,
    cities,
    countries,
    posts,
    referers,
    devices,
    browsers,
    oses,
  };
}

export type GetProjectAnalytics = Awaited<
  ReturnType<typeof getProjectAnalytics>
>;

export async function getCurrentUserRole(projectId: string) {
  const user = await getCurrentUser();

  const projectMember = await prisma.projectMembers.findFirst({
    where: {
      projectId,
      userId: user.id,
    },
    select: {
      role: true,
    },
  });

  return projectMember?.role ?? "EDITOR";
}
