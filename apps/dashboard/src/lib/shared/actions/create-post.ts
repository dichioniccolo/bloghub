"use server";

import { redirect } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

import { AppRoutes } from "@acme/common/routes";
import { and, db, eq, posts, projectMembers } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const createPost = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
    })
    .superRefine(async (input, ctx) => {
      const { projectId, userId } = input;

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
        ctx.addIssue({
          code: "custom",
          message: "You must be a member of the project",
          path: ["projectId"],
        });
      }
    }),
)(async ({ projectId }) => {
  const slug = createId();

  const post = await db
    .insert(posts)
    .values({
      id: createId(),
      projectId,
      slug,
      title: "",
      content: "",
    })
    .returning({
      id: posts.id,
    })
    .then((x) => x[0]);

  if (!post) {
    return;
  }

  redirect(AppRoutes.PostEditor(projectId, post.id));
});
