"use server";

import {
  and,
  db,
  desc,
  eq,
  inArray,
  likes,
  ne,
  posts,
  projects,
  sql,
} from "@acme/db";

import { generateRandomIndices } from "~/lib/utils";

const skip = (page: number, perPage: number) => (page - 1) * perPage;
const take = (perPage: number) => perPage;

export async function getMainPagePostsByDomain(
  domain: string,
  page = 1,
  perPage = 20,
) {
  const postsList = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      thumbnailUrl: posts.thumbnailUrl,
      description: posts.description,
      content: posts.content,
      createdAt: posts.createdAt,
      likesCount: sql<number>`count(${likes.userId})`.mapWith(Number),
    })
    .from(posts)
    .innerJoin(
      projects,
      and(eq(projects.id, posts.projectId), eq(projects.domain, domain)),
    )
    .where(eq(posts.hidden, false))
    .offset(skip(page, perPage))
    .leftJoin(likes, eq(likes.postId, posts.id))
    .limit(take(perPage))
    .groupBy(
      posts.id,
      posts.slug,
      posts.title,
      posts.thumbnailUrl,
      posts.description,
      posts.content,
      posts.createdAt,
    )
    .orderBy(desc(posts.createdAt));

  const postsCount = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(posts)
    .where(eq(posts.hidden, false))
    .then((x) => x[0]!);

  return { posts: postsList, postsCount: postsCount.count };
}
export type GetPostsProjectByDomain = Awaited<
  ReturnType<typeof getMainPagePostsByDomain>
>["posts"];

export async function getPostBySlug(domain: string, slug: string) {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      thumbnailUrl: posts.thumbnailUrl,
      content: posts.content,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      createdAt: posts.createdAt,
      project: {
        name: projects.name,
        logo: projects.logo,
        domain: projects.domain,
      },
    })
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.hidden, false)))
    .innerJoin(
      projects,
      and(eq(projects.id, posts.projectId), eq(projects.domain, domain)),
    )
    .then((x) => x[0]);
}

export async function getRandomPostsByDomain(
  domain: string,
  currentPostSlug: string,
  toGenerate = 3,
) {
  const postsList = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(and(eq(posts.hidden, false), ne(posts.slug, currentPostSlug)))
    .innerJoin(
      projects,
      and(eq(projects.id, posts.projectId), eq(projects.domain, domain)),
    );

  const postIds = postsList.map((post) => post.id);

  const randomIndices = generateRandomIndices(postIds.length, toGenerate);

  const ids = randomIndices.map((index) => postIds[index]!).filter(Boolean);

  if (ids.length === 0) {
    return [];
  }

  return await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      description: posts.description,
      thumbnailUrl: posts.thumbnailUrl,
      content: posts.content,
      createdAt: posts.createdAt,
      likesCount: sql<number>`count(${likes.userId})`.mapWith(Number),
    })
    .from(posts)
    .where(inArray(posts.id, ids))
    .leftJoin(likes, eq(likes.postId, posts.id))
    .groupBy(
      posts.id,
      posts.slug,
      posts.title,
      posts.description,
      posts.thumbnailUrl,
      posts.content,
      posts.createdAt,
    );
}

export type GetRandomPostsByDomain = Awaited<
  ReturnType<typeof getRandomPostsByDomain>
>;
