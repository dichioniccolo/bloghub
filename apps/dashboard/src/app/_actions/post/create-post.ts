"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_MEMBER_MESSAGE, isProjectMember } from "../schemas";

export const createPost = createServerAction({
  actionName: "createPost",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: z.string().min(1),
  }),
  action: async ({ input: { projectId }, ctx: { user } }) => {
    if (!(await isProjectMember(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_MEMBER_MESSAGE);
    }

    const post = await prisma.posts.create({
      data: {
        projectId,
        title: "",
        description: "",
        content: {},
      },
      select: {
        id: true,
      },
    });

    redirect(AppRoutes.PostEditor(projectId, post.id));
  },
});
