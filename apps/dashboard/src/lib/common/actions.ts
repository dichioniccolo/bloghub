"use server";

import type { JSONContent } from "@tiptap/react";

import {
  and,
  db,
  eq,
  gte,
  inArray,
  lte,
  media,
  MediaForEntity,
  posts,
  projectMembers,
  projects,
  Role,
  sql,
  visits
} from "@bloghub/db";

import { env } from "~/env.mjs";
import { deleteMedias } from "./external/media/actions";

export async function getUserTotalUsage(userId: string, from: Date, to: Date) {
  const visit = await db
    .select({
      count: sql<number>`count(${visits.id})`.mapWith(Number),
    })
    .from(visits)
    .where(and(gte(visits.createdAt, from), lte(visits.createdAt, to)))
    .innerJoin(projects, eq(projects.id, visits.projectId))
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, projects.id),
        eq(projectMembers.userId, userId),
        eq(projectMembers.role, Role.Owner),
      ),
    )
    .then((x) => x[0]!);

  return visit.count;
}

export async function deleteUnusedMediaInPost(postId: string) {
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .then((x) => x[0]);

  if (!post) {
    return;
  }

  const mediaList = await db
    .select({
      id: media.id,
      url: media.url,
    })
    .from(media)
    .where(
      and(
        eq(media.postId, postId),
        eq(media.forEntity, MediaForEntity.PostContent),
      ),
    );

  if (mediaList.length === 0) {
    return;
  }

  const matches = findMediaInJsonContent(post.content);

  const deletedMedias = mediaList.filter((m) => !matches.includes(m.url));

  if (deletedMedias.length === 0) {
    return;
  }

  await deleteMedias(deletedMedias.map((m) => m.url));
  await db.delete(media).where(
    inArray(
      media.id,
      deletedMedias.map((m) => m.id),
    ),
  );
}

const findMediaInJsonContent = (content?: JSONContent): string[] => {
  if (!content) {
    return [];
  }

  if (typeof content === "string") {
    return [];
  }

  if (Array.isArray(content)) {
    return content.flatMap(findMediaInJsonContent);
  }

  if (content.attrs?.src) {
    const src = content.attrs.src as string;

    if (src.includes(env.DO_CDN_URL)) {
      return [src];
    }
  }

  return findMediaInJsonContent(content.content);
};
