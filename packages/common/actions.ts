"use server";

import {
  and,
  db,
  eq,
  gte,
  inArray,
  lte,
  media,
  posts,
  projectMembers,
  projects,
  sql,
  visits,
} from "@acme/db";

import { deleteMedias } from "./external/media/actions";
import { deleteDomain } from "./external/vercel";

export async function deleteProject(project: { id: string; domain: string }) {
  await db.transaction(async (tx) => {
    await deleteDomain(project.domain);

    await tx.delete(projects).where(eq(projects.id, project.id));
  });
}

export async function getUserTotalUsage(userId: string, from: Date, to: Date) {
  const visit = await db
    .select({
      count: sql<number>`count(${visits.id})`,
    })
    .from(visits)
    .where(and(gte(visits.createdAt, from), lte(visits.createdAt, to)))
    .innerJoin(projects, eq(projects.id, visits.projectId))
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, projects.id),
        eq(projectMembers.userId, userId),
        eq(projectMembers.role, "owner"),
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
    .where(eq(media.postId, postId));

  if (mediaList.length === 0) {
    return;
  }

  // match all html urls with any characters containing the value of env.DO_CDN_URL
  const regex = /<[^>]+src="([^"]+)"/g;

  let match: RegExpExecArray | null;
  const matches: string[] = [];

  while ((match = regex.exec(post.content)) !== null) {
    if (!match[1]) {
      continue;
    }

    matches.push(match[1]);
  }

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
