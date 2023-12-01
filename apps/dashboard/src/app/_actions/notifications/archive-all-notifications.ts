"use server";

import { z } from "zod";

import { db, NotificationStatus } from "@acme/db";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";

export const archiveAllNotifications = createServerAction({
  actionName: "archiveAllNotifications",
  middlewares: authenticatedMiddlewares,
  schema: z.object({}),
  action: async ({ ctx: { user } }) => {
    await db.notification.updateMany({
      where: {
        userId: user.id,
        status: {
          in: [NotificationStatus.READ, NotificationStatus.UNREAD],
        },
      },
      data: {
        status: NotificationStatus.UNREAD,
      },
    });
  },
});
