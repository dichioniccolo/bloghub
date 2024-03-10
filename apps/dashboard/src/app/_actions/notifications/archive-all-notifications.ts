"use server";

import { z } from "zod";

import { prisma } from "@acme/db";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";

export const archiveAllNotifications = createServerAction({
  actionName: "archiveAllNotifications",
  middlewares: authenticatedMiddlewares,
  schema: z.object({}),
  action: async ({ ctx: { user } }) => {
    await prisma.notifications.updateMany({
      where: {
        userId: user.id,
        status: {
          in: ["READ", "UNREAD"],
        },
      },
      data: {
        status: "ARCHIVED",
      },
    });
  },
});
