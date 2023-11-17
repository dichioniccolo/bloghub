"use server";

import { format } from "date-fns";

import { db, Role } from "@acme/db";
import { UNKNOWN_ANALYTICS_VALUE } from "@acme/lib/constants";
import type { AnalyticsInterval } from "@acme/lib/utils";
import { roundDateToInterval } from "@acme/lib/utils";
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
          role: Role.OWNER,
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
          role: Role.OWNER,
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
      geoCountry: filters.country ? filters.country : undefined,
      geoCity: filters.city ? filters.city : undefined,
      post: {
        slug: filters.slug ? filters.slug : undefined,
      },
      referer: filters.referer ? filters.referer : undefined,
      deviceType: filters.device ? filters.device : undefined,
      browserName: filters.browser ? filters.browser : undefined,
      osName: filters.os ? filters.os : undefined,
    },
    select: {
      project: {
        select: {
          domain: true,
        },
      },
      post: {
        select: {
          slug: true,
        },
      },
      geoCountry: true,
      geoCity: true,
      deviceType: true,
      browserName: true,
      osName: true,
      referer: true,
      createdAt: true,
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
      const slug = visit.post?.slug ?? "DELETED";

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

  const projectMember = await db.projectMember.findUniqueOrThrow({
    where: {
      projectId_userId: {
        projectId,
        userId: user.id,
      },
    },
    select: {
      role: true,
    },
  });

  return projectMember.role;
}
