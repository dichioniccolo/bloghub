"use server";

import { z } from "zod";

import { db, eq, users } from "@acme/db";

import { $getUser } from "~/app/_api/get-user";
import { zactAuthenticated } from "~/lib/zact/server";

export const updateUser = zactAuthenticated(
  async () => {
    const user = await $getUser();

    return {
      userId: user.id,
    };
  },
  () =>
    z.object({
      name: z.string().nonempty(),
    }),
)(async ({ name }, { userId }) => {
  await db
    .update(users)
    .set({
      name,
    })
    .where(eq(users.id, userId));
});
