"use server";

import { z } from "zod";

import { and, db, eq, inArray, schema } from "@acme/db";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";

export const archiveAllNotifications = createServerAction({
  actionName: "archiveAllNotifications",
  middlewares: authenticatedMiddlewares,
  schema: z.object({}),
  action: async ({ ctx: { user } }) => {
    await db
      .update(schema.notifications)
      .set({
        status: "UNREAD",
      })
      .where(
        and(
          eq(schema.notifications.userId, user.id),
          inArray(schema.notifications.status, ["READ", "UNREAD"]),
        ),
      );
  },
});
