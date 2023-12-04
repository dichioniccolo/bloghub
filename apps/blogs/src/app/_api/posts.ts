"use server";

import {
  and,
  desc,
  drizzleDb,
  eq,
  exists,
  inArray,
  ne,
  schema,
  withCount,
} from "@acme/db";
import { generateRandomIndices } from "@acme/lib/utils";

const skip = (page: number, perPage: number) => (page - 1) * perPage;
const take = (perPage: number) => perPage;

export async function getMainPagePostsByDomain(
  domain: string,
  page = 1,
  perPage = 100,
) {
  const posts = await drizzleDb
    .select({
      id: schema.posts.id,
      slug: schema.posts.slug,
      title: schema.posts.title,
      thumbnailUrl: schema.posts.thumbnailUrl,
      description: schema.posts.description,
      createdAt: schema.posts.createdAt,
    })
    .from(schema.posts)
    .where(
      and(
        eq(schema.posts.hidden, 0),
        exists(
          drizzleDb
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
    )
    .limit(take(perPage))
    .offset(skip(page, perPage))
    .orderBy(desc(schema.posts.createdAt));

  const postsCount = await withCount(
    schema.posts,
    and(
      eq(schema.posts.hidden, 0),
      exists(
        drizzleDb
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

  return { posts, postsCount: postsCount };
}
export type GetPostsProjectByDomain = Awaited<
  ReturnType<typeof getMainPagePostsByDomain>
>["posts"];

export async function getPostBySlug(domain: string, slug: string) {
  return await drizzleDb
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
    .where(
      and(
        eq(schema.posts.hidden, 0),
        eq(schema.posts.slug, slug),
        exists(
          drizzleDb
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
    )
    .then((x) => x[0]);
}

export async function getRandomPostsByDomain(
  domain: string,
  currentPostSlug: string,
  toGenerate = 3,
) {
  const posts = await drizzleDb
    .select({
      id: schema.posts.id,
    })
    .from(schema.posts)
    .where(
      and(
        eq(schema.posts.hidden, 0),
        ne(schema.posts.slug, currentPostSlug),
        exists(
          drizzleDb
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

  return await drizzleDb.query.posts.findMany({
    where: inArray(schema.posts.id, ids),
    columns: {
      id: true,
      slug: true,
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
