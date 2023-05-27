"use server";

import { z } from "zod";

import { prisma } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const updateUser = zact(
  z.object({
    userId: z.string(),
    name: z.string().nonempty(),
  }),
)(async ({ userId, name }) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
    },
  });
});
