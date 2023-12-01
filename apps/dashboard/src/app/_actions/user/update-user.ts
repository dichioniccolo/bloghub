"use server";

import { z } from "zod";

import { db } from "@acme/db";
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

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
      },
    });
  },
});
