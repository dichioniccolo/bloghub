"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { Role, prisma } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const quitProject = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
    })
    .superRefine(async ({ userId, projectId }, ctx) => {
      const isOwnerCount = await prisma.projectUser.count({
        where: {
          userId,
          projectId,
          role: Role.OWNER,
        },
      });

      if (isOwnerCount > 0) {
        ctx.addIssue({
          code: "custom",
          message: "You cannot quit a project you own.",
          path: ["projectId"],
        });
      }
    }),
)(async ({ userId, projectId }) => {
  await prisma.projectUser.deleteMany({
    where: {
      userId,
      projectId,
    },
  });

  revalidatePath("/");
  redirect("/");
});
