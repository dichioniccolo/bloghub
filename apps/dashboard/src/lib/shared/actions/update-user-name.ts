"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const updateUser = zact(
  z.object({
    userId: z.string(),
    name: z.string(),
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

  // TODO: Do we really need this?
  revalidatePath("/settings");
});
