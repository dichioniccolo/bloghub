"use server";

import { z } from "zod";

import { db, eq, users } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const updateUser = zact(
  z.object({
    userId: z.string(),
    name: z.string().nonempty(),
  }),
)(async ({ userId, name }) => {
  await db
    .update(users)
    .set({
      name,
    })
    .where(eq(users.id, userId));
});
