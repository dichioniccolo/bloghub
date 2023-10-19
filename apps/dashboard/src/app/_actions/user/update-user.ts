"use server";

import { z } from "zod";

import { db, eq, users } from "@acme/db";

import { authenticatedAction } from "../authenticated-action";

export const updateUser = authenticatedAction(() =>
  z.object({
    name: z.string().min(1),
  }),
)(async ({ name }, { userId }) => {
  await db
    .update(users)
    .set({
      name,
    })
    .where(eq(users.id, userId));
});
