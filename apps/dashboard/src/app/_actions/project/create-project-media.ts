"use server";

import { z } from "zod";

import { db, genId, MediaForEntity, MediaType } from "@acme/db";
import { uploadFile } from "@acme/files";

import { getCurrentUser } from "~/app/_api/get-user";

function arrayBufferToBuffer(ab: ArrayBuffer) {
  const buffer = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);

  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i]!;
  }

  return buffer;
}

const CreateProjectMediaSchema = z.object({
  projectId: z.string().min(1),
  postId: z.string().optional().nullable(),
  forEntity: z.nativeEnum(MediaForEntity),
  type: z.nativeEnum(MediaType),
});

export async function createProjectMedia(formData: FormData) {
  const user = await getCurrentUser();

  const { projectId, postId, forEntity, type } =
    await CreateProjectMediaSchema.parseAsync({
      projectId: formData.get("projectId"),
      postId: formData.get("postId"),
      forEntity: formData.get("forEntity"),
      type: formData.get("type"),
    });

  if (!type) {
    throw new Error("Failed to determine media type");
  }

  const projectMemberCount = await db.projectMember.count({
    where: {
      projectId,
      userId: user.id,
    },
  });

  if (projectMemberCount === 0) {
    throw new Error("You must be a member of the project");
  }

  const file = formData.get("file") as File;

  if (file.size / 1024 / 1024 > 5) {
    throw new Error("File size too big (max 5MB)");
  }

  const extension = file.name.split(".").pop();

  const fileName = `projects/${projectId}/${genId()}.${extension}`;

  const fileAsBuffer = arrayBufferToBuffer(await file.arrayBuffer());

  const uploadedFile = await uploadFile(fileName, fileAsBuffer, file.type);

  if (!uploadedFile) {
    throw new Error("Failed to upload file");
  }

  const url = uploadedFile.url;

  const media = await db.media.create({
    data: {
      forEntityEnum: forEntity,
      projectId,
      postId,
      type,
      url,
    },
  });

  return media;
}
