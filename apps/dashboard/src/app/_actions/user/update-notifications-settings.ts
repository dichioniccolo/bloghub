"use server";

import { z } from "zod";

import { prisma } from "@acme/db";
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
    await prisma.$transaction(async (tx) => {
      await tx.emailNotificationSettings.upsert({
        where: {
          type_userId: {
            userId: user.id,
            type: "COMMUNICATION",
          },
        },
        create: {
          userId: user.id,
          type: "COMMUNICATION",
          value: communication,
        },
        update: {
          value: communication,
        },
      });

      await tx.emailNotificationSettings.upsert({
        where: {
          type_userId: {
            userId: user.id,
            type: "MARKETING",
          },
        },
        create: {
          userId: user.id,
          type: "MARKETING",
          value: marketing,
        },
        update: {
          value: marketing,
        },
      });

      await tx.emailNotificationSettings.upsert({
        where: {
          type_userId: {
            userId: user.id,
            type: "SOCIAL",
          },
        },
        create: {
          userId: user.id,
          type: "SOCIAL",
          value: social,
        },
        update: {
          value: social,
        },
      });

      await tx.emailNotificationSettings.upsert({
        where: {
          type_userId: {
            userId: user.id,
            type: "SECURITY",
          },
        },
        create: {
          userId: user.id,
          type: "SECURITY",
          value: security,
        },
        update: {
          value: security,
        },
      });
    });
  },
});
