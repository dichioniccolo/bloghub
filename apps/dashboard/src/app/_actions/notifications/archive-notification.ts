"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
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
    await db
      .update(schema.notifications)
      .set({
        status: "ARCHIVED",
      })
      .where(
        and(
          eq(schema.notifications.id, notificationId),
          eq(schema.notifications.userId, user.id),
        ),
      );
  },
});
