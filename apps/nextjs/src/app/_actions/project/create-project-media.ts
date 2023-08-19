"use server";

import type { MediaEnumType, MediaForEntityType } from "@acme/db";
import { and, db, eq, genId, media, projectMembers } from "@acme/db";

import { $getUser } from "~/app/_api/get-user";
import { env } from "~/env.mjs";
import { uploadFile } from "~/lib/common/external/media/actions";

function arrayBufferToBuffer(ab: ArrayBuffer) {
  const buffer = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);

  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i]!;
  }

  return buffer;
}

export async function createProjectMedia(formData: FormData) {
  const user = await $getUser();

  const projectId = formData.get("projectId") as string;
  const postId = formData.get("postId") as string;
  const forEntity = parseInt(
    formData.get("forEntity")?.toString() ?? "",
  ) as MediaForEntityType;

  const type = parseInt(
    formData.get("type")?.toString() ?? "",
  ) as MediaEnumType;

  if (!type) {
    throw new Error("Failed to determine media type");
  }

  const projectMember = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, user.id),
      ),
    );

  if (projectMember.length === 0) {
    throw new Error("You must be a member of the project");
  }

  const file = formData.get("file") as File;

  if (file.size / 1024 / 1024 > 5) {
    throw new Error("File size too big (max 5MB)");
  }

  const extension = file.name.split(".").pop();

  const fileName = `projects/${projectId}/${genId()}.${extension}`;

  const fileAsBuffer = arrayBufferToBuffer(await file.arrayBuffer());

  const uploadedFile = await uploadFile(fileName, fileAsBuffer, file.type, {
    projectId,
    postId,
  });

  if (!uploadedFile) {
    throw new Error("Failed to upload file");
  }

  const id = genId();

  await db.insert(media).values({
    id,
    forEntity,
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
