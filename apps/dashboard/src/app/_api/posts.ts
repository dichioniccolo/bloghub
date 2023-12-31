"use server";

import {
  and,
  count,
  countDistinct,
  db,
  desc,
  eq,
  exists,
  like,
  or,
  schema,
  withCount,
} from "@acme/db";

import { getCurrentUser } from "./get-user";

export async function getPosts(
  projectId: string,
  pagination: { page: number; pageSize: number },
  filter?: string,
) {
  const user = await getCurrentUser();

  const where = and(
    eq(schema.posts.projectId, projectId),
    exists(
      db
        .select({
          count: count(),
        })
        .from(schema.projectMembers)
        .where(
          and(
            eq(schema.projectMembers.projectId, schema.posts.projectId),
            eq(schema.projectMembers.userId, user.id),
          ),
        ),
    ),
    filter ? or(like(schema.posts.title, `%${filter}%`)) : undefined,
  );

  const data = await db
    .select({
      id: schema.posts.id,
      title: schema.posts.title,
      createdAt: schema.posts.createdAt,
      hidden: schema.posts.hidden,
      visits: countDistinct(schema.visits.id),
    })
    .from(schema.posts)
    .leftJoin(schema.visits, eq(schema.visits.postId, schema.posts.id))
    .limit(pagination.pageSize)
    .offset(pagination.pageSize * pagination.page - pagination.pageSize)
    .orderBy(desc(schema.posts.createdAt))
    .where(where)
    .groupBy(
      schema.posts.id,
      schema.posts.title,
      schema.posts.createdAt,
      schema.posts.hidden,
    );

  const dataCount = await withCount(schema.posts, where);

  return {
    data,
    count: dataCount,
  };
}

export type GetPosts = Awaited<ReturnType<typeof getPosts>>;

export async function getPost(projectId: string, postId: string) {
  const user = await getCurrentUser();

  return await db.query.posts.findFirst({
    where: and(
      eq(schema.posts.projectId, projectId),
      eq(schema.posts.id, postId),
      exists(
        db
          .select()
          .from(schema.projectMembers)
          .where(
            and(
              eq(schema.projectMembers.projectId, schema.posts.projectId),
              eq(schema.projectMembers.userId, user.id),
            ),
          ),
      ),
    ),
    columns: {
      id: true,
      projectId: true,
      title: true,
      description: true,
      createdAt: true,
      hidden: true,
      content: true,
      thumbnailUrl: true,
      seoTitle: true,
      seoDescription: true,
    },
    with: {
      project: {
        columns: {
          name: true,
          domain: true,
        },
      },
    },
  });
}

export type GetPost = Awaited<ReturnType<typeof getPost>>;
