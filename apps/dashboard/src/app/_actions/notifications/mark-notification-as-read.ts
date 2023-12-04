"use server";

import { z } from "zod";

import { and, drizzleDb, eq, schema } from "@acme/db";
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
    await drizzleDb
      .update(schema.notifications)
      .set({
        status: "READ",
      })
      .where(
        and(
          eq(schema.notifications.id, notificationId),
          eq(schema.notifications.userId, user.id),
        ),
      );
  },
});
