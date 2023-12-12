"use server";

import {
  and,
  countDistinct,
  db,
  desc,
  eq,
  exists,
  inArray,
  ne,
  schema,
} from "@acme/db";
import { generateRandomIndices } from "@acme/lib/utils";

interface PostsPaginationOptions {
  offset?: number;
  limit?: number;
}

export async function getPosts(
  projectId: string,
  { offset = 0, limit = 3 }: PostsPaginationOptions,
) {
  return await db
    .select({
      id: schema.posts.id,
      title: schema.posts.title,
      description: schema.posts.description,
      thumbnailUrl: schema.posts.thumbnailUrl,
      visits: countDistinct(schema.visits.id),
    })
    .from(schema.posts)
    .leftJoin(schema.visits, eq(schema.visits.postId, schema.posts.id))
    .offset(offset)
    .limit(limit)
    .orderBy(desc(schema.posts.createdAt))
    .where(and(eq(schema.posts.projectId, projectId)))
    .groupBy(
      schema.posts.id,
      schema.posts.title,
      schema.posts.description,
      schema.posts.thumbnailUrl,
    );
}

export async function getPostById(domain: string, postId: string) {
  return await db
    .select({
      id: schema.posts.id,
      title: schema.posts.title,
      description: schema.posts.description,
      thumbnailUrl: schema.posts.thumbnailUrl,
      content: schema.posts.content,
      seoTitle: schema.posts.seoTitle,
      seoDescription: schema.posts.seoDescription,
      createdAt: schema.posts.createdAt,
      project: {
        name: schema.projects.name,
        logo: schema.projects.logo,
        domain: schema.projects.domain,
      },
    })
    .from(schema.posts)
    .innerJoin(
      schema.projects,
      and(eq(schema.projects.id, schema.posts.projectId)),
    )
    .where(
      and(
        eq(schema.posts.hidden, 0),
        eq(schema.posts.id, postId),
        eq(schema.projects.domain, domain),
      ),
    )
    .then((x) => x[0]);
}

export async function getRandomPostsByDomain(
  domain: string,
  postId: string,
  toGenerate = 3,
) {
  const posts = await db
    .select({
      id: schema.posts.id,
    })
    .from(schema.posts)
    .where(
      and(
        eq(schema.posts.hidden, 0),
        ne(schema.posts.id, postId),
        exists(
          db
            .select()
            .from(schema.projects)
            .where(
              and(
                eq(schema.projects.id, schema.posts.projectId),
                eq(schema.projects.domain, domain),
              ),
            ),
        ),
      ),
    );

  const postIds = posts.map((post) => post.id);

  const randomIndices = generateRandomIndices(postIds.length, toGenerate);

  const ids = randomIndices.map((index) => postIds[index]!).filter(Boolean);

  if (ids.length === 0) {
    return [];
  }

  return await db.query.posts.findMany({
    where: inArray(schema.posts.id, ids),
    columns: {
      id: true,
      title: true,
      description: true,
      thumbnailUrl: true,
      createdAt: true,
    },
  });
}

export type GetRandomPostsByDomain = Awaited<
  ReturnType<typeof getRandomPostsByDomain>
>;
