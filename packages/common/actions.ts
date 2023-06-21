"use server";

import { createId } from "@paralleldrive/cuid2";
import { type JSONContent } from "@tiptap/react";

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
  Role,
  sql,
  visits,
  type MediaEnumType,
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
    .where(eq(media.postId, postId));

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

  const type = parseInt(
    formData.get("type")?.toString() ?? "",
  ) as MediaEnumType;

  const fileAsBuffer = arrayBufferToBuffer(await file.arrayBuffer());

  const uploadedFile = await uploadFile(fileName, fileAsBuffer, file.type, {
    projectId,
    postId,
  });

  if (!uploadedFile) {
    throw new Error("Failed to upload file");
  }

  if (!type) {
    throw new Error("Failed to determine media type");
  }

  const id = createId();

  await db.insert(media).values({
    id,
    projectId,
    postId,
    type,
    url: `${env.DO_CDN_URL}/${fileName}`,
  });

  return await db
    .select({
      url: media.url,
    })
    .from(media)
    .where(eq(media.id, id))
    .then((x) => x[0]!);
}
