"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AppRoutes } from "@acme/common/routes";
import { and, db, eq, posts, projectMembers, projects, sql } from "@acme/db";
import { zact } from "@acme/zact/server";

export const deletePost = zact(
  z
    .object({
      userId: z.string().nonempty(),
      postId: z.string().nonempty(),
      projectId: z.string().nonempty(),
    })
    .superRefine(async ({ userId, postId, projectId }, ctx) => {
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
          message: "You must be a member of the project to perform this action",
          path: ["projectId"],
        });
      }
    }),
)(async ({ userId, projectId, postId }) => {
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

  revalidatePath(AppRoutes.ProjectDashboard(projectId));
});
