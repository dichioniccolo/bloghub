"use server";

import {
  and,
  db,
  desc,
  eq,
  posts,
  projectMembers,
  projects,
  sql,
  visits,
} from "@bloghub/db";

import { $getUser } from "./get-user";

export async function getPosts(projectId: string) {
  const user = await $getUser();

  return await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      createdAt: posts.createdAt,
      hidden: posts.hidden,
      visitsCount: sql<number>`count(${visits.id})`.mapWith(Number),
    })
    .from(posts)
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, posts.projectId),
        eq(projectMembers.userId, user.id),
      ),
    )
    .leftJoin(visits, eq(visits.postId, posts.id))
    .where(eq(posts.projectId, projectId))
    .groupBy(posts.id, posts.title, posts.slug, posts.createdAt, posts.hidden);
}

export type GetPosts = Awaited<ReturnType<typeof getPosts>>;

export async function getPost(projectId: string, postId: string) {
  const user = await $getUser();

  return await db
    .select({
      id: posts.id,
      projectId: posts.projectId,
      title: posts.title,
      slug: posts.slug,
      createdAt: posts.createdAt,
      hidden: posts.hidden,
      content: posts.content,
      project: {
        name: projects.name,
        domain: projects.domain,
      },
    })
    .from(posts)
    .innerJoin(projects, eq(projects.id, posts.projectId))
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, posts.projectId),
        eq(projectMembers.userId, user.id),
      ),
    )
    .where(and(eq(posts.projectId, projectId), eq(posts.id, postId)))
    .then((x) => x[0]);
}

export type GetPost = Awaited<ReturnType<typeof getPost>>;

export async function getPostAnalytics(projectId: string, postId: string) {
  const user = await $getUser();

  const clicksMyMonth = await db
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
    .where(and(eq(visits.projectId, projectId), eq(visits.postId, postId)))
    .orderBy(sql`YEAR(${visits.createdAt})`, sql`MONTH(${visits.createdAt})`)
    .groupBy(sql`YEAR(${visits.createdAt})`, sql`MONTH(${visits.createdAt})`);

  const topPosts = await db
    .select({
      id: visits.postId,
      slug: sql`coalesce(${posts.slug}, 'DELETED')`,
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
    .where(and(eq(visits.projectId, projectId), eq(visits.postId, postId)))
    .limit(5)
    .groupBy(visits.postId)
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
    .where(and(eq(visits.projectId, projectId), eq(visits.postId, postId)))
    .limit(5)
    .groupBy(visits.geoCountry)
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
    .where(and(eq(visits.projectId, projectId), eq(visits.postId, postId)))
    .limit(5)
    .groupBy(visits.geoCountry, visits.geoCity)
    .orderBy(desc(sql`count(*)`));

  return {
    clicksMyMonth,
    topPosts,
    topCountries,
    topCities,
  };
}

export type GetPostAnalytics = Awaited<ReturnType<typeof getPostAnalytics>>;
