"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db, genId } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";

import { authenticatedAction } from "../authenticated-action";
import { isProjectMember } from "../schemas";

export const createPost = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isProjectMember(projectId, userId, ctx);
    }),
)(async ({ projectId }) => {
  const slug = genId();

  const post = await db.post.create({
    data: {
      projectId,
      slug,
      title: "",
      description: "",
      content: {},
    },
  });

  redirect(AppRoutes.PostEditor(projectId, post.id));
});
