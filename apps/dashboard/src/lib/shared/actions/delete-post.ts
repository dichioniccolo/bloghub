"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AppRoutes } from "@acme/common/routes";
import { and, db, eq, posts, projectMembers, projects } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const deletePost = zact(
  z.object({
    userId: z.string(),
    postId: z.string(),
    projectId: z.string(),
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
    .then((x) => x[0]);

  if (!post) {
    throw new Error("Post not found");
  }

  await db.delete(posts).where(eq(posts.id, post.id));

  revalidatePath(AppRoutes.ProjectDashboard(projectId));
});
