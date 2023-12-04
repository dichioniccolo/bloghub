"use server";

import { format } from "date-fns";

import type { SQL } from "@acme/db";
import {
  aliasedTable,
  and,
  countDistinct,
  drizzleDb,
  eq,
  exists,
  gte,
  schema,
  withCount,
} from "@acme/db";
import { UNKNOWN_ANALYTICS_VALUE } from "@acme/lib/constants";
import type { AnalyticsInterval } from "@acme/lib/utils";
import { intervalsFilters, roundDateToInterval } from "@acme/lib/utils";
import {
  isSubscriptionPlanPro,
  stripePriceToSubscriptionPlan,
} from "@acme/stripe/plans";

import { getCurrentUser } from "./get-user";
import { getUserTotalUsage } from "./get-user-total-usage";
import { getBillingPeriod } from "./user";

export async function getProjects() {
  const user = await getCurrentUser();

  return await drizzleDb.query.projects.findMany({
    where: exists(
      drizzleDb
        .select()
        .from(schema.projectMembers)
        .where(
          and(
            eq(schema.projects.id, schema.projectMembers.projectId),
            eq(schema.projectMembers.userId, user.id),
          ),
        ),
    ),
    columns: {
      id: true,
      name: true,
      logo: true,
      domain: true,
      domainVerified: true,
    },
    with: {
      members: {
        where: eq(schema.projectMembers.userId, user.id),
      },
    },
    extras: {
      posts: countDistinct(schema.posts.id).as("posts"),
      visits: countDistinct(schema.visits.id).as("visits"),
    },
  });
}
export type GetProjects = Awaited<ReturnType<typeof getProjects>>;

export async function getProject(id: string) {
  const user = await getCurrentUser();

  return await drizzleDb.query.projects.findFirst({
    where: and(
      eq(schema.projects.id, id),
      exists(
        drizzleDb
          .select()
          .from(schema.projectMembers)
          .where(
            and(
              eq(schema.projects.id, schema.projectMembers.projectId),
              eq(schema.projectMembers.userId, user.id),
            ),
          ),
      ),
    ),
    columns: {
      id: true,
      name: true,
      logo: true,
      domain: true,
      domainVerified: true,
    },
    with: {
      members: {
        where: eq(schema.projectMembers.userId, user.id),
      },
    },
  });
}

export type GetProject = Awaited<ReturnType<typeof getProject>>;

// We need to show only projects where the user is the owner
export async function getProjectsCount() {
  const user = await getCurrentUser();

  const count = await withCount(
    schema.projects,
    exists(
      drizzleDb
        .select()
        .from(schema.projectMembers)
        .where(
          and(
            eq(schema.projects.id, schema.projectMembers.projectId),
            eq(schema.projectMembers.userId, user.id),
            eq(schema.projectMembers.role, "OWNER"),
          ),
        ),
    ),
  );

  return count;
}

export async function getProjectUsers(projectId: string) {
  const user = await getCurrentUser();

  const alias = aliasedTable(schema.projectMembers, "pm");

  return await drizzleDb.query.projectMembers.findMany({
    where: and(
      eq(schema.projectMembers.projectId, projectId),
      exists(
        drizzleDb
          .select()
          .from(alias)
          .where(
            and(
              eq(alias.projectId, schema.projectMembers.projectId),
              eq(alias.userId, user.id),
            ),
          ),
      ),
    ),
    columns: {
      role: true,
      createdAt: true,
    },
    with: {
      user: {
        columns: {
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

  return await drizzleDb.query.projectInvitations.findMany({
    where: and(
      eq(schema.projectInvitations.projectId, projectId),
      exists(
        drizzleDb
          .select()
          .from(schema.projectMembers)
          .where(
            and(
              eq(
                schema.projectMembers.projectId,
                schema.projectInvitations.projectId,
              ),
              eq(schema.projectMembers.userId, user.id),
            ),
          ),
      ),
    ),
    columns: {
      email: true,
      createdAt: true,
      expiresAt: true,
    },
  });
}

export type GetProjectInvites = Awaited<ReturnType<typeof getProjectInvites>>;

export async function getProjectOwner(projectId: string) {
  const user = await getCurrentUser();

  const owner = await drizzleDb.query.user.findFirst({
    where: exists(
      drizzleDb
        .select()
        .from(schema.projectMembers)
        .where(
          and(
            eq(schema.projectMembers.projectId, projectId),
            eq(schema.projectMembers.role, "OWNER"),
          ),
        ),
    ),
    columns: {
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
  return await drizzleDb.query.projectInvitations.findFirst({
    where: and(
      eq(schema.projectInvitations.email, email),
      eq(schema.projectInvitations.projectId, projectId),
    ),
    columns: {
      expiresAt: true,
    },
    with: {
      project: {
        columns: {
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

  const where: SQL[] = [];

  if (intervalFilter.createdAt) {
    where.push(gte(schema.visits.createdAt, intervalFilter.createdAt));
  }

  if (filters.country) {
    where.push(eq(schema.visits.geoCountry, filters.country));
  }

  if (filters.city) {
    where.push(eq(schema.visits.geoCity, filters.city));
  }

  if (filters.slug) {
    where.push(eq(schema.posts.slug, filters.slug));
  }

  if (filters.referer) {
    where.push(eq(schema.visits.referer, filters.referer));
  }

  if (filters.device) {
    where.push(eq(schema.visits.deviceType, filters.device));
  }

  if (filters.browser) {
    where.push(eq(schema.visits.browserName, filters.browser));
  }

  if (filters.os) {
    where.push(eq(schema.visits.osName, filters.os));
  }

  const allVisits = await drizzleDb
    .select({
      geoCountry: schema.visits.geoCountry,
      geoCity: schema.visits.geoCity,
      deviceType: schema.visits.deviceType,
      browserName: schema.visits.browserName,
      osName: schema.visits.osName,
      referer: schema.visits.referer,
      createdAt: schema.visits.createdAt,
      project: {
        domain: schema.projects.domain,
      },
      post: {
        slug: schema.posts.slug,
      },
    })
    .from(schema.visits)
    .innerJoin(schema.projects, eq(schema.projects.id, schema.visits.projectId))
    .innerJoin(schema.posts, eq(schema.posts.id, schema.visits.postId))
    .where(
      and(
        eq(schema.visits.projectId, projectId),
        exists(
          drizzleDb
            .select()
            .from(schema.projectMembers)
            .where(
              and(
                eq(schema.projectMembers.projectId, schema.visits.projectId),
                eq(schema.projectMembers.userId, user.id),
              ),
            ),
        ),
        ...where,
      ),
    );

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

  const projectMember = await drizzleDb.query.projectMembers.findFirst({
    where: and(
      eq(schema.projectMembers.projectId, projectId),
      eq(schema.projectMembers.userId, user.id),
    ),
    columns: {
      role: true,
    },
  });

  return projectMember?.role ?? "EDITOR";
}
