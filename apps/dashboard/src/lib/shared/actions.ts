"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { Role, prisma } from "@acme/db";

import { zact } from "../zact/server";

export const createProject = zact(
  z.object({
    userId: z.string(),
    name: z.string().min(3),
    domain: z
      .string()
      .min(3)
      .refine(async (domain) => {
        const count = await prisma.project.count({
          where: {
            domain,
          },
        });

        return count === 0;
      }, "Domain already exists"),
  }),
)(async (input) => {
  const { userId, name, domain } = input;

  const project = await prisma.project.create({
    data: {
      name,
      domain,
      users: {
        create: {
          role: Role.OWNER,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    },
  });

  revalidatePath("/");

  return project;
});
