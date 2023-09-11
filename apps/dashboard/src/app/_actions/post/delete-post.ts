"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { and, db, eq, posts, projectMembers, projects, sql } from "@acme/db";
import { inngest } from "@acme/inngest";

import { $getUser } from "~/app/_api/get-user";
import { AppRoutes } from "~/lib/routes";
import { zactAuthenticated } from "~/lib/zact/server";

export const deletePost = zactAuthenticated(
  async () => {
    const user = await $getUser();

    return {
      userId: user.id,
    };
  },
  ({ userId }) =>
    z
      .object({
        postId: z.string().nonempty(),
        projectId: z.string().nonempty(),
      })
      .superRefine(async ({ postId, projectId }, ctx) => {
        const post = await db
          .select({
            count: sql<number>`count(*)`.mapWith(Number),
          })
          .from(posts)
          .where(eq(posts.id, postId))
          .innerJoin(
            projects,
            and(eq(projects.id, posts.projectId), eq(projects.id, projectId)),
          )
          .innerJoin(
            projectMembers,
            and(
              eq(projectMembers.projectId, projects.id),
              eq(projectMembers.userId, userId),
            ),
          )
          .then((x) => x[0]!);

        if (post.count === 0) {
          ctx.addIssue({
            code: "custom",
            message:
              "You must be a member of the project to perform this action",
            path: ["projectId"],
          });
        }
      }),
)(async ({ projectId, postId }, { userId }) => {
  const post = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(eq(posts.id, postId))
    .innerJoin(projects, eq(projects.id, posts.projectId))
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, projects.id),
        eq(projectMembers.userId, userId),
      ),
    )
    .then((x) => x[0]!);

  await db.delete(posts).where(eq(posts.id, post.id));

  await inngest.send({
    name: "post/delete",
    data: {
      projectId,
      postId: post.id,
    },
  });

  revalidatePath(AppRoutes.ProjectDashboard(projectId));
});
