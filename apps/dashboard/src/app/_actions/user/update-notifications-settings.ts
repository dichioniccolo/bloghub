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
          value: communication,
        })
        .onConflictDoUpdate({
          target: [
            schema.emailNotificationSettings.userId,
            schema.emailNotificationSettings.type,
          ],
          set: {
            value: communication,
          },
        });

      await tx
        .insert(schema.emailNotificationSettings)
        .values({
          userId: user.id,
          type: "MARKETING",
          value: marketing,
        })
        .onConflictDoUpdate({
          target: [
            schema.emailNotificationSettings.userId,
            schema.emailNotificationSettings.type,
          ],
          set: {
            value: marketing,
          },
        });
      await tx
        .insert(schema.emailNotificationSettings)
        .values({
          userId: user.id,
          type: "SOCIAL",
          value: social,
        })
        .onConflictDoUpdate({
          target: [
            schema.emailNotificationSettings.userId,
            schema.emailNotificationSettings.type,
          ],
          set: {
            value: social,
          },
        });

      await tx
        .insert(schema.emailNotificationSettings)
        .values({
          userId: user.id,
          type: "SECURITY",
          value: security,
        })
        .onConflictDoUpdate({
          target: [
            schema.emailNotificationSettings.userId,
            schema.emailNotificationSettings.type,
          ],
          set: {
            value: security,
          },
        });
    });
  },
});
