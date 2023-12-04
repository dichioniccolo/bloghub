"use server";

import { z } from "zod";

import { db, eq, schema } from "@acme/db";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";

export const updateUser = createServerAction({
  actionName: "updateUser",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    name: z.string().min(1),
  }),
  action: async ({ input: { name }, ctx }) => {
    const { user } = ctx;

    await db
      .update(schema.user)
      .set({
        name,
      })
      .where(eq(schema.user.id, user.id));
  },
});
