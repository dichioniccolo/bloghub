"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";

import { prisma } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const createPost = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
      title: z.string().min(3),
    })
    .superRefine(async (input, ctx) => {
      const { projectId, userId } = input;

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
    }),
)(async ({ projectId, title }) => {
  const slug = nanoid().toLowerCase();

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      project: {
        connect: {
          id: projectId,
        },
      },
      published: false,
    },
  });

  revalidatePath(`/projects/${projectId}`);

  return post;
});
