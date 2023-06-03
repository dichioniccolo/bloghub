"use server";

import { redirect } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

import { AppRoutes } from "@acme/common/routes";
import { prisma } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const createPost = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
      title: z.string().min(3).max(128),
      description: z.string().optional(),
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
)(async ({ projectId, title, description }) => {
  const slug = createId().toLowerCase();

  const post = await prisma.post.create({
    data: {
      title,
      description,
      slug,
      project: {
        connect: {
          id: projectId,
        },
      },
      hidden: true,
      content: "",
    },
  });

  // revalidatePath(AppRoutes.ProjectDashboard(projectId));
  redirect(AppRoutes.PostEditor(projectId, post.id));

  // return post;
});
