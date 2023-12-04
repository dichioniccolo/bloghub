"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { and, drizzleDb, eq, schema } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_MEMBER_MESSAGE, isProjectMember } from "../schemas";

export const unpublishPost = createServerAction({
  actionName: "unpublishPost",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    postId: RequiredString,
    projectId: RequiredString,
  }),
  action: async ({ input: { projectId, postId }, ctx: { user } }) => {
    if (!(await isProjectMember(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_MEMBER_MESSAGE);
    }

    const post = await drizzleDb.query.posts.findFirst({
      where: eq(schema.posts.id, postId),
      columns: {
        id: true,
        hidden: true,
      },
    });

    if (!post) {
      return;
    }

    await drizzleDb
      .update(schema.posts)
      .set({
        hidden: post.hidden === 1 ? 0 : 1,
      })
      .where(and(eq(schema.posts.id, post.id)));

    revalidatePath(AppRoutes.PostEditor(projectId, postId));
  },
});
