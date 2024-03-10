"use server";

import { z } from "zod";

import { prisma } from "@acme/db";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";

export const markNotificationAsRead = createServerAction({
  actionName: "markNotificationAsRead",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    notificationId: RequiredString,
  }),
  action: async ({ input: { notificationId }, ctx: { user } }) => {
    await prisma.notifications.update({
      where: {
        id: notificationId,
        userId: user.id,
      },
      data: {
        status: "READ",
      },
    });
  },
});
