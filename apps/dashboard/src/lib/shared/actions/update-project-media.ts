"use server";

import { z } from "zod";

import { prisma } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const updateProjectMedia = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
      mediaId: z.string(),
      url: z.string().url(),
    })
    .superRefine(async (input, ctx) => {
      const { projectId, userId, mediaId } = input;

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
        ctx.addIssue({
          code: "custom",
          message: "You must be a member of the project",
          path: ["projectId"],
        });
      }

      const mediaCount = await prisma.media.count({
        where: {
          id: mediaId,
          projectId,
        },
      });

      if (mediaCount === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Media does not exist",
          path: ["mediaId"],
        });
      }
    }),
)(async ({ mediaId, url }) => {
  const media = await prisma.media.update({
    where: {
      id: mediaId,
    },
    data: {
      url,
    },
  });

  return media;
});
