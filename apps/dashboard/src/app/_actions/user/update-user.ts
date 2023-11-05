"use server";

import { z } from "zod";

import { db } from "@acme/db";

import { authenticatedAction } from "../authenticated-action";

export const updateUser = authenticatedAction(() =>
  z.object({
    name: z.string().min(1),
  }),
)(async ({ name }, { userId }) => {
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
    },
  });
});
