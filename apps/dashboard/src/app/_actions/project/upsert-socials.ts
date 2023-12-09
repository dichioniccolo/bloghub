"use server";

import { z } from "zod";

import type { ProjectSocialType } from "@acme/db";
import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_MEMBER_MESSAGE, isProjectMember } from "../schemas";

export const upsertSocials = createServerAction({
  actionName: "upsertSocials",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: z.string().min(1),
    socials: z.array(
      z.object({
        social: z.string().min(1),
        value: z.string().min(1),
      }),
    ),
  }),
  action: async ({ input: { projectId, socials }, ctx: { user } }) => {
    if (!(await isProjectMember(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_MEMBER_MESSAGE);
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(schema.projectSocials)
        .where(and(eq(schema.projectSocials.projectId, projectId)));

      await tx.insert(schema.projectSocials).values(
        socials.map((social) => ({
          projectId,
          social: social.social as ProjectSocialType,
          value: social.value,
        })),
      );
    });
  },
});
