"use server";

import { z } from "zod";

import { db, EmailNotificationSettingType } from "@acme/db";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";

export const updateNotificationSettings = createServerAction({
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
    await db.$transaction(async (tx) => {
      await tx.emailNotificationSetting.upsert({
        where: {
          type_userId: {
            type: EmailNotificationSettingType.COMMUNICATION,
            userId: user.id,
          },
        },
        create: {
          userId: user.id,
          type: EmailNotificationSettingType.COMMUNICATION,
          value: communication,
        },
        update: {
          value: communication,
        },
      });

      await tx.emailNotificationSetting.upsert({
        where: {
          type_userId: {
            type: EmailNotificationSettingType.MARKETING,
            userId: user.id,
          },
        },
        create: {
          userId: user.id,
          type: EmailNotificationSettingType.MARKETING,
          value: marketing,
        },
        update: {
          value: marketing,
        },
      });

      await tx.emailNotificationSetting.upsert({
        where: {
          type_userId: {
            type: EmailNotificationSettingType.SOCIAL,
            userId: user.id,
          },
        },
        create: {
          userId: user.id,
          type: EmailNotificationSettingType.SOCIAL,
          value: social,
        },
        update: {
          value: social,
        },
      });

      await tx.emailNotificationSetting.upsert({
        where: {
          type_userId: {
            type: EmailNotificationSettingType.SECURITY,
            userId: user.id,
          },
        },
        create: {
          userId: user.id,
          type: EmailNotificationSettingType.SECURITY,
          value: security,
        },
        update: {
          value: security,
        },
      });
    });
  },
});
