"use server";

import { z } from "zod";

import { and, db, eq, genId, posts, projectMembers } from "@acme/db";

import { $getUser } from "~/app/_api/get-user";
import { zactAuthenticated } from "~/lib/zact/server";

export const createPost = zactAuthenticated(
  async () => {
    const user = await $getUser();

    return {
      userId: user.id,
    };
  },
  ({ userId }) =>
    z
      .object({
        projectId: z.string().nonempty(),
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
    content: {},
  });

  return await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(eq(posts.id, id))
    .then((x) => x[0]!);

  // TODO: implement when fixed
  // redirect(AppRoutes.PostEditor(projectId, post.id));
});
