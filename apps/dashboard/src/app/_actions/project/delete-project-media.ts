"use server";

import { z } from "zod";

import { db } from "@acme/db";
import { deleteFile } from "@acme/files";

import { authenticatedAction } from "../authenticated-action";
import { isProjectMember } from "../schemas";

export const deleteProjectMedia = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      url: z.string().url(),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isProjectMember(projectId, userId, ctx);
    }),
)(async ({ projectId, url }) => {
  const media = await db.media.findFirst({
    where: {
      projectId,
      url,
    },
    select: {
      id: true,
      url: true,
    },
  });

  if (!media) {
    return;
  }

  await db.$transaction(async (tx) => {
    await deleteFile(media.url);
    await tx.media.delete({
      where: {
        id: media.id,
      },
    });
  });
});
