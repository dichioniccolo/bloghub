"use server";

import type { JSONContent } from "@tiptap/react";

import {
  and,
  automaticEmails,
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
  visits,
} from "@bloghub/db";

import { env } from "~/env.mjs";
import { deleteMedias } from "./external/media/actions";
import { deleteDomain } from "./external/vercel";

export async function deleteProject(project: { id: string; domain: string }) {
  if (!project) {
    throw new Error("Project not given");
  }

  await db.transaction(async (tx) => {
    await deleteDomain(project.domain);

    const mediaList = await db
      .select({
        url: media.url,
      })
      .from(media)
      .where(eq(media.projectId, project.id));

    if (mediaList.length > 0) {
      await deleteMedias(mediaList.map((m) => m.url));
    }

    await tx.delete(media).where(eq(media.projectId, project.id));

    await tx.delete(posts).where(eq(posts.projectId, project.id));

    await tx
      .delete(automaticEmails)
      .where(eq(automaticEmails.projectId, project.id));

    await tx
      .delete(projectMembers)
      .where(eq(projectMembers.projectId, project.id));

    await tx.delete(visits).where(eq(visits.projectId, project.id));

    await tx.delete(projects).where(eq(projects.id, project.id));
  });
}

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
