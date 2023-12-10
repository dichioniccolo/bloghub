"use server";

import { z } from "zod";

import type { ProjectSocialType } from "@acme/db";
import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_MEMBER_MESSAGE, isProjectMember } from "../schemas";

export const upsertSocials = createServerAction({
  actionName: "upsertSocials",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: RequiredString,
    socials: z.array(
      z.object({
        social: RequiredString,
        value: z.string().optional().nullable(),
      }),
    ),
  }),
  action: async ({ input: { projectId, socials }, ctx: { user } }) => {
    if (!(await isProjectMember(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_MEMBER_MESSAGE);
    }

    const nonNullSocials = socials.filter(
      (x) => x.value !== null && x.value !== undefined && x.value !== "",
    );

    await db.transaction(async (tx) => {
      await tx
        .delete(schema.projectSocials)
        .where(and(eq(schema.projectSocials.projectId, projectId)));

      if (nonNullSocials.length > 0) {
        await tx.insert(schema.projectSocials).values(
          nonNullSocials.map((x) => ({
            projectId,
            social: x.social as ProjectSocialType,
            value: x.value!,
          })),
        );
      }
    });
  },
});
