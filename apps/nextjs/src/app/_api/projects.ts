"use server";

import {
    aliasedTable,
    and,
    db,
    desc,
    eq,
    posts,
    projectInvitations,
    projectMembers,
    projects,
    Role,
    sql,
    users,
    visits,
} from "@acme/db";

import { getUserTotalUsage } from "~/lib/common/actions";
import { determinePlanByPriceId } from "~/lib/common/external/stripe/actions";
import { $getUser } from "./get-user";
import { getBillingPeriod } from "./user";

export async function getProjects() {
  const user = await $getUser();

  return await db
    .select({
      id: projects.id,
      name: projects.name,
      logo: projects.logo,
      domain: projects.domain,
      domainVerified: projects.domainVerified,
      currentUserRole: projectMembers.role,
      postsCount: sql<number>`count(distinct ${posts.id})`.mapWith(Number),
      visitsCount: sql<number>`count(distinct ${visits.id})`.mapWith(Number),
    })
    .from(projects)
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, projects.id),
        eq(projectMembers.userId, user.id),
      ),
    )
    .leftJoin(posts, eq(posts.projectId, projects.id))
    .leftJoin(visits, eq(visits.projectId, projects.id))
    .groupBy(
      projects.id,
      projects.name,
      projects.logo,
      projects.domain,
      projects.domainVerified,
      projectMembers.role,
    );
}
export type GetProjects = Awaited<ReturnType<typeof getProjects>>;

export async function getProject(id: string) {
  const user = await $getUser();

  return await db
    .select({
      id: projects.id,
      name: projects.name,
      logo: projects.logo,
      domain: projects.domain,
      domainVerified: projects.domainVerified,
      currentUserRole: projectMembers.role,
    })
    .from(projects)
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, projects.id),
        eq(projectMembers.userId, user.id),
      ),
    )
    .where(eq(projects.id, id))
    .then((x) => x[0]);
}

export type GetProject = Awaited<ReturnType<typeof getProject>>;

// We need to show only projects where the user is the owner
export async function getProjectsCount() {
  const user = await $getUser();

  const projectsCount = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.userId, user.id),
        eq(projectMembers.role, Role.Owner),
      ),
    )
    .then((x) => x[0]!);

  return projectsCount.count;
}

export async function getProjectUsers(projectId: string) {
  const user = await $getUser();

  const projectMembersAlias = aliasedTable(projectMembers, "pm");

  return await db
    .select({
      role: projectMembers.role,
      createdAt: projectMembers.createdAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(projectMembers)
    .innerJoin(
      projectMembersAlias,
      and(
        eq(projectMembersAlias.projectId, projectMembers.projectId),
        eq(projectMembersAlias.userId, user.id),
      ),
    )
    .innerJoin(users, eq(users.id, projectMembers.userId))
    .where(eq(projectMembers.projectId, projectId));
}

export type GetProjectUsers = Awaited<ReturnType<typeof getProjectUsers>>;

export async function getProjectInvites(projectId: string) {
  const user = await $getUser();

  return await db
    .select({
      email: projectInvitations.email,
      createdAt: projectInvitations.createdAt,
      expiresAt: projectInvitations.expiresAt,
    })
    .from(projectInvitations)
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, projectInvitations.projectId),
        eq(projectMembers.userId, user.id),
      ),
    )
    .where(eq(projectInvitations.projectId, projectId));
}

export type GetProjectInvites = Awaited<ReturnType<typeof getProjectInvites>>;

export async function getProjectOwner(projectId: string) {
  const user = await $getUser();

  const projectMembersAlias = aliasedTable(projectMembers, "pm");

  const owner = await db
    .select({
      stripePriceId: users.stripePriceId,
      dayWhenBillingStarts: users.dayWhenBillingStarts,
    })
    .from(projectMembers)
    .innerJoin(
      projectMembersAlias,
      and(
        eq(projectMembersAlias.projectId, projectMembers.projectId),
        eq(projectMembersAlias.role, Role.Owner),
      ),
    )
    .innerJoin(users, eq(users.id, projectMembersAlias.userId))
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, user.id),
      ),
    )
    .then((x) => x[0]!);

  const billingPeriod = await getBillingPeriod(owner.dayWhenBillingStarts);

  const usage = await getUserTotalUsage(
    user.id,
    billingPeriod[0],
    billingPeriod[1],
  );

  const plan = await determinePlanByPriceId(user.email, owner.stripePriceId);

  return {
    usage,
    quota: plan.quota,
    isPro: plan.isPro,
  };
}

export type GetProjectOwner = Awaited<ReturnType<typeof getProjectOwner>>;

export async function getPendingInvite(email: string, projectId: string) {
  return await db
    .select({
      expiresAt: projectInvitations.expiresAt,
      project: {
        id: projects.id,
        name: projects.name,
      },
    })
    .from(projectInvitations)
    .innerJoin(projects, eq(projects.id, projectInvitations.projectId))
    .where(
      and(
        eq(projectInvitations.projectId, projectId),
        eq(projectInvitations.email, email),
      ),
    )
    .then((x) => x[0]!);
}

export type GetPendingInvite = Awaited<ReturnType<typeof getPendingInvite>>;

export async function getProjectAnalytics(projectId: string) {
  const user = await $getUser();

  const visitsByMonth = await db
    .select({
      year: sql<number>`YEAR(${visits.createdAt})`.mapWith(Number),
      month: sql<number>`MONTH(${visits.createdAt})`.mapWith(Number),
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(visits)
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, visits.projectId),
        eq(projectMembers.userId, user.id),
      ),
    )
    .where(eq(visits.projectId, projectId))
    .orderBy(sql`YEAR(${visits.createdAt})`, sql`MONTH(${visits.createdAt})`)
    .groupBy(sql`YEAR(${visits.createdAt})`, sql`MONTH(${visits.createdAt})`);

  const topPosts = await db
    .select({
      id: visits.postId,
      slug: sql<string>`coalesce(${posts.slug}, 'DELETED')`,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(visits)
    .leftJoin(posts, eq(posts.id, visits.postId))
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, visits.projectId),
        eq(projectMembers.userId, user.id),
      ),
    )
    .where(eq(visits.projectId, projectId))
    .groupBy(visits.postId)
    .limit(5)
    .orderBy(desc(sql`count(*)`));

  const topCountries = await db
    .select({
      country: sql<string>`coalesce(${visits.geoCountry}, 'Other')`,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(visits)
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, visits.projectId),
        eq(projectMembers.userId, user.id),
      ),
    )
    .where(eq(visits.projectId, projectId))
    .groupBy(visits.geoCountry)
    .limit(5)
    .orderBy(desc(sql`count(*)`));

  const topCities = await db
    .select({
      country: sql<string>`coalesce(${visits.geoCountry}, 'Other')`,
      city: sql<string>`coalesce(${visits.geoCity}, 'Other')`,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(visits)
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, visits.projectId),
        eq(projectMembers.userId, user.id),
      ),
    )
    .where(eq(visits.projectId, projectId))
    .groupBy(visits.geoCountry, visits.geoCity)
    .limit(5)
    .orderBy(desc(sql`count(*)`));

  const topReferers = await db
    .select({
      referer: sql<string>`coalesce(${visits.referer}, 'Other')`,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(visits)
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, visits.projectId),
        eq(projectMembers.userId, user.id),
      ),
    )
    .where(eq(visits.projectId, projectId))
    .groupBy(visits.referer)
    .limit(5)
    .orderBy(desc(sql`count(*)`));

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

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// export async function getProjectVisitCount(projectId: string) {
//   const user = await $getUser();

//   await sleep(10000);

//   const { count } = await db
//     .select({
//       count: sql<number>`count(*)`.mapWith(Number),
//     })
//     .from(visits)
//     .innerJoin(
//       projectMembers,
//       and(
//         eq(projectMembers.projectId, visits.projectId),
//         eq(projectMembers.userId, user.id),
//       ),
//     )
//     .where(eq(visits.projectId, projectId))
//     .then((x) => x[0]!);

//   return count;
// }

// export async function getProjectPostsCount(projectId: string) {
//   const user = await $getUser();

//   await sleep(15000);

//   const { count } = await db
//     .select({
//       count: sql<number>`count(*)`.mapWith(Number),
//     })
//     .from(posts)
//     .innerJoin(
//       projectMembers,
//       and(
//         eq(projectMembers.projectId, posts.projectId),
//         eq(projectMembers.userId, user.id),
//       ),
//     )
//     .where(eq(posts.projectId, projectId))
//     .then((x) => x[0]!);

//   return count;
// }
