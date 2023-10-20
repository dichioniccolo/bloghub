"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { and, db, eq, genId, posts, projectMembers } from "@acme/db";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";

import { authenticatedAction } from "../authenticated-action";

export const createPost = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
    })
    .superRefine(async ({ projectId }, ctx) => {
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
  const slug = genId();

  const id = genId();

  await db.insert(posts).values({
    id,
    projectId,
    slug,
    title: "",
    description: "",
    content: {},
  });

  const post = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(eq(posts.id, id))
    .then((x) => x[0]!);

  await inngest.send({
    name: "post/create",
    data: {
      projectId,
      postId: post.id,
    },
  });

  redirect(AppRoutes.PostEditor(projectId, post.id));
});
