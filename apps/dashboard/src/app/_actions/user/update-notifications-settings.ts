"use server";

import { z } from "zod";

import {
  db,
  EmailNotificationSetting,
  emailNotificationSettings,
} from "@acme/db";
import { zactAuthenticated } from "@acme/zact/server";

import { $getUser } from "~/app/_api/get-user";

export const updateNotificationSettings = zactAuthenticated(
  async () => {
    const user = await $getUser();

    return {
      userId: user.id,
    };
  },
  ({ userId }) =>
    z.object({
      communication_emails: z.boolean().default(true),
      marketing_emails: z.boolean().default(true),
      social_emails: z.boolean().default(true),
      security_emails: z.literal(true),
    }),
)(
  async (
    { communication_emails, marketing_emails, social_emails, security_emails },
    { userId },
  ) => {
    await db.transaction(async (tx) => {
      await tx
        .insert(emailNotificationSettings)
        .values({
          userId,
          type: EmailNotificationSetting.Communication,
          value: communication_emails,
        })
        .onDuplicateKeyUpdate({
          set: {
            value: communication_emails,
          },
        });

      await tx
        .insert(emailNotificationSettings)
        .values({
          userId,
          type: EmailNotificationSetting.Marketing,
          value: marketing_emails,
        })
        .onDuplicateKeyUpdate({
          set: {
            value: marketing_emails,
          },
        });

      await tx
        .insert(emailNotificationSettings)
        .values({
          userId,
          type: EmailNotificationSetting.Social,
          value: social_emails,
        })
        .onDuplicateKeyUpdate({
          set: {
            value: social_emails,
          },
        });

      await tx
        .insert(emailNotificationSettings)
        .values({
          userId,
          type: EmailNotificationSetting.Security,
          value: security_emails,
        })
        .onDuplicateKeyUpdate({
          set: {
            value: security_emails,
          },
        });
    });
  },
);
