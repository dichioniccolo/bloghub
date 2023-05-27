"use server";

import { z } from "zod";

import { EmailNotificationSettingType, prisma } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const updateNotificationSettings = zact(
  z.object({
    userId: z.string().nonempty(),
    communication_emails: z.boolean().default(true),
    marketing_emails: z.boolean().default(true),
    social_emails: z.boolean().default(true),
  }),
)(async ({ userId, communication_emails, marketing_emails, social_emails }) => {
  await prisma.$transaction(async (tx) => {
    await tx.emailNotificationSetting.upsert({
      where: {
        userId_type: {
          userId,
          type: EmailNotificationSettingType.COMMUNICATION,
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
        userId_type: {
          userId,
          type: EmailNotificationSettingType.MARKETING,
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
        userId_type: {
          userId,
          type: EmailNotificationSettingType.SOCIAL,
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
  });
});
