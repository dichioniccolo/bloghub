"use server";

import { createId } from "@paralleldrive/cuid2";

import { uploadFile } from "@acme/common/external/media/actions";
import { prisma, type Media, type MediaType } from "@acme/db";

import { env } from "~/env.mjs";

function arrayBufferToBuffer(ab: ArrayBuffer) {
  const buffer = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);

  for (let i = 0; i < buffer.length; ++i) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    buffer[i] = view[i]!;
  }

  return buffer;
}

export async function createProjectMedia(formData: FormData): Promise<Media> {
  const userId = formData.get("userId") as string;
  const projectId = formData.get("projectId") as string;
  const postId = formData.get("postId") as string;

  const count = await prisma.project.count({
    where: {
      id: projectId,
      users: {
        some: {
          userId,
        },
      },
    },
  });

  if (count === 0) {
    throw new Error("You must be a member of the project");
  }

  const file = formData.get("file") as File;

  const fileName = `projects/${projectId}/posts/${postId}/assets/${createId()}`;

  const type = formData.get("type") as MediaType;

  const fileAsBuffer = arrayBufferToBuffer(await file.arrayBuffer());

  const uploadedFile = await uploadFile(fileName, fileAsBuffer, {
    projectId,
    postId,
  });

  if (!uploadedFile) {
    throw new Error("Failed to upload file");
  }

  const media = await prisma.media.create({
    data: {
      projectId,
      postId,
      type,
      url: `${env.DO_CDN_URL}/${fileName}`,
      uploadedById: userId,
    },
  });

  return media;
}
