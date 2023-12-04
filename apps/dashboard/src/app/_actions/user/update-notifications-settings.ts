"use server";

import { z } from "zod";

import { db, schema } from "@acme/db";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";

export const updateNotificationSettings = createServerAction({
  actionName: "updateNotificationSettings",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    communication: z.coerce.boolean().default(true),
    marketing: z.coerce.boolean().default(true),
    social: z.coerce.boolean().default(true),
    security: z.literal(true),
  }),
  action: async ({
    input: { communication, marketing, social, security },
    ctx: { user },
  }) => {
    await db.transaction(async (tx) => {
      await tx
        .insert(schema.emailNotificationSettings)
        .values({
          userId: user.id,
          type: "COMMUNICATION",
          value: communication ? 1 : 0,
        })
        .onDuplicateKeyUpdate({
          set: {
            value: communication ? 1 : 0,
          },
        });

      await tx
        .insert(schema.emailNotificationSettings)
        .values({
          userId: user.id,
          type: "MARKETING",
          value: marketing ? 1 : 0,
        })
        .onDuplicateKeyUpdate({
          set: {
            value: marketing ? 1 : 0,
          },
        });
      await tx
        .insert(schema.emailNotificationSettings)
        .values({
          userId: user.id,
          type: "SOCIAL",
          value: social ? 1 : 0,
        })
        .onDuplicateKeyUpdate({
          set: {
            value: social ? 1 : 0,
          },
        });

      await tx
        .insert(schema.emailNotificationSettings)
        .values({
          userId: user.id,
          type: "SECURITY",
          value: security ? 1 : 0,
        })
        .onDuplicateKeyUpdate({
          set: {
            value: security ? 1 : 0,
          },
        });
    });
  },
});
