"use server";

import { z } from "zod";

import { db, NotificationStatus } from "@acme/db";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";

export const archiveNotification = createServerAction({
  actionName: "archiveNotification",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    notificationId: RequiredString,
  }),
  action: async ({ input: { notificationId }, ctx: { user } }) => {
    await db.notification.update({
      where: {
        id: notificationId,
        userId: user.id,
      },
      data: {
        status: NotificationStatus.ARCHIVED,
      },
    });
  },
});
