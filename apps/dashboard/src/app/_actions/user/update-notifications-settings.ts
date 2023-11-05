"use server";

import { z } from "zod";

import { db, EmailNotificationSettingType } from "@acme/db";

import { authenticatedAction } from "../authenticated-action";

export const updateNotificationSettings = authenticatedAction(() =>
  z.object({
    communication_emails: z.coerce.boolean().default(true),
    marketing_emails: z.coerce.boolean().default(true),
    social_emails: z.coerce.boolean().default(true),
    security_emails: z.literal(true),
  }),
)(async (
  { communication_emails, marketing_emails, social_emails, security_emails },
  { userId },
) => {
  await db.$transaction(async (tx) => {
    await tx.emailNotificationSetting.upsert({
      where: {
        type_userId: {
          type: EmailNotificationSettingType.COMMUNICATION,
          userId,
        },
      },
      create: {
        userId,
        type: EmailNotificationSettingType.COMMUNICATION,
        value: communication_emails,
      },
      update: {
        value: communication_emails,
      },
    });

    await tx.emailNotificationSetting.upsert({
      where: {
        type_userId: {
          type: EmailNotificationSettingType.MARKETING,
          userId,
        },
      },
      create: {
        userId,
        type: EmailNotificationSettingType.MARKETING,
        value: marketing_emails,
      },
      update: {
        value: marketing_emails,
      },
    });

    await tx.emailNotificationSetting.upsert({
      where: {
        type_userId: {
          type: EmailNotificationSettingType.SOCIAL,
          userId,
        },
      },
      create: {
        userId,
        type: EmailNotificationSettingType.SOCIAL,
        value: social_emails,
      },
      update: {
        value: social_emails,
      },
    });

    await tx.emailNotificationSetting.upsert({
      where: {
        type_userId: {
          type: EmailNotificationSettingType.SECURITY,
          userId,
        },
      },
      create: {
        userId,
        type: EmailNotificationSettingType.SECURITY,
        value: security_emails,
      },
      update: {
        value: security_emails,
      },
    });
  });
});
