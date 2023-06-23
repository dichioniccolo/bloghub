"use server";

import { and, db, eq, posts, projectMembers, sql, visits } from "@acme/db";

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
    })
    .from(posts)
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
