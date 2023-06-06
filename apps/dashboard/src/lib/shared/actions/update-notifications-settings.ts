"use server";

import { z } from "zod";

import { and, db, emailNotificationSettings, eq } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const updateNotificationSettings = zact(
  z.object({
    userId: z.string().nonempty(),
    communication_emails: z.boolean().default(true),
    marketing_emails: z.boolean().default(true),
    social_emails: z.boolean().default(true),
    security_emails: z.literal(true),
  }),
)(
  async ({
    userId,
    communication_emails,
    marketing_emails,
    social_emails,
    security_emails,
  }) => {
    await db.transaction(async (tx) => {
      await tx
        .insert(emailNotificationSettings)
        .values({
          userId,
          type: "communication",
          value: communication_emails,
        })
        .onConflictDoUpdate({
          target: [
            emailNotificationSettings.userId,
            emailNotificationSettings.type,
          ],
          set: {
            value: communication_emails,
          },
          where: and(
            eq(emailNotificationSettings.userId, userId),
            eq(emailNotificationSettings.type, "communication"),
          ),
        });

      await tx
        .insert(emailNotificationSettings)
        .values({
          userId,
          type: "marketing",
          value: marketing_emails,
        })
        .onConflictDoUpdate({
          target: [
            emailNotificationSettings.userId,
            emailNotificationSettings.type,
          ],
          set: {
            value: marketing_emails,
          },
          where: and(
            eq(emailNotificationSettings.userId, userId),
            eq(emailNotificationSettings.type, "marketing"),
          ),
        });

      await tx
        .insert(emailNotificationSettings)
        .values({
          userId,
          type: "social",
          value: social_emails,
        })
        .onConflictDoUpdate({
          target: [
            emailNotificationSettings.userId,
            emailNotificationSettings.type,
          ],
          set: {
            value: social_emails,
          },
          where: and(
            eq(emailNotificationSettings.userId, userId),
            eq(emailNotificationSettings.type, "social"),
          ),
        });

      await tx
        .insert(emailNotificationSettings)
        .values({
          userId,
          type: "security",
          value: security_emails,
        })
        .onConflictDoUpdate({
          target: [
            emailNotificationSettings.userId,
            emailNotificationSettings.type,
          ],
          set: {
            value: security_emails,
          },
          where: and(
            eq(emailNotificationSettings.userId, userId),
            eq(emailNotificationSettings.type, "security"),
          ),
        });
    });
  },
);
