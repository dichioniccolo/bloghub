"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { and, drizzleDb, eq, exists, schema } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_MEMBER_MESSAGE, isProjectMember } from "../schemas";

export const deletePost = createServerAction({
  actionName: "deletePost",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    postId: RequiredString,
    projectId: RequiredString,
  }),
  action: async ({ input: { projectId, postId }, ctx: { user } }) => {
    if (!(await isProjectMember(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_MEMBER_MESSAGE);
    }

    await drizzleDb.delete(schema.posts).where(
      and(
        eq(schema.posts.projectId, projectId),
        eq(schema.posts.id, postId),
        exists(
          drizzleDb
            .select()
            .from(schema.projectMembers)
            .where(
              and(
                eq(schema.projectMembers.projectId, schema.posts.projectId),
                eq(schema.projectMembers.userId, user.id),
              ),
            ),
        ),
      ),
    );

    revalidatePath(AppRoutes.ProjectDashboard(projectId));
  },
});
