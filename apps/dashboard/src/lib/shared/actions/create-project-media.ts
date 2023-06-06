"use server";

import { createId } from "@paralleldrive/cuid2";

import { uploadFile } from "@acme/common/external/media/actions";
import {
  and,
  db,
  eq,
  media,
  projectMembers,
  type mediaTypeEnum,
} from "@acme/db";

import { env } from "~/env.mjs";

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

  //     projectId,
  //     postId,
  //     type,
  //     url: `${env.DO_CDN_URL}/${fileName}`,
  //     uploadedById: userId,
  //   },
  //   select: {
  //     url: true,
  //   },
  // });

  // return media;
}
