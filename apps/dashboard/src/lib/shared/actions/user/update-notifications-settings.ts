"use server";

import { z } from "zod";

import {
  and,
  db,
  EmailNotificationSetting,
  emailNotificationSettings,
  eq,
} from "@acme/db";
import { zact } from "@acme/zact/server";

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
          type: EmailNotificationSetting.Communication,
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
            eq(
              emailNotificationSettings.type,
              EmailNotificationSetting.Communication,
            ),
          ),
        });

      await tx
        .insert(emailNotificationSettings)
        .values({
          userId,
          type: EmailNotificationSetting.Marketing,
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
            eq(
              emailNotificationSettings.type,
              EmailNotificationSetting.Marketing,
            ),
          ),
        });

      await tx
        .insert(emailNotificationSettings)
        .values({
          userId,
          type: EmailNotificationSetting.Social,
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
            eq(emailNotificationSettings.type, EmailNotificationSetting.Social),
          ),
        });

      await tx
        .insert(emailNotificationSettings)
        .values({
          userId,
          type: EmailNotificationSetting.Security,
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
            eq(
              emailNotificationSettings.type,
              EmailNotificationSetting.Security,
            ),
          ),
        });
    });
  },
);
