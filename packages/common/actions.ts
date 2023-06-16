"use server";

import { createId } from "@paralleldrive/cuid2";

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
  type mediaTypeEnum,
} from "@acme/db";

import { env } from "./env.mjs";
import { deleteMedias, uploadFile } from "./external/media/actions";
import { deleteDomain } from "./external/vercel";

export async function deleteProject(project: { id: string; domain: string }) {
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

function arrayBufferToBuffer(ab: ArrayBuffer) {
  const buffer = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);

  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i]!;
  }

  return buffer;
}

export async function createProjectMedia(formData: FormData) {
  const userId = formData.get("userId") as string;
  const projectId = formData.get("projectId") as string;
  const postId = formData.get("postId") as string;

  const projectMember = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId),
      ),
    );

  if (projectMember.length === 0) {
    throw new Error("You must be a member of the project");
  }

  const file = formData.get("file") as File;

  const extension = file.name.split(".").pop();

  const fileName = `projects/${projectId}/posts/${postId}/assets/${createId()}.${extension}`;

  const type = formData.get(
    "type",
  ) as (typeof mediaTypeEnum.enumValues)[number];

  const fileAsBuffer = arrayBufferToBuffer(await file.arrayBuffer());

  const uploadedFile = await uploadFile(fileName, fileAsBuffer, file.type, {
    projectId,
    postId,
  });

  if (!uploadedFile) {
    throw new Error("Failed to upload file");
  }

  return await db
    .insert(media)
    .values({
      id: createId(),
      projectId,
      postId,
      type,
      url: `${env.DO_CDN_URL}/${fileName}`,
    })
    .returning({
      url: media.url,
    })
    .then((x) => x[0]!);
}
