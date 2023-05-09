"use server";

import { zact } from "zact/server";
import { z } from "zod";

import { Role, prisma } from "@acme/db";

export const createProject = zact(
  z.object({
    userId: z.string(),
    name: z.string().min(3),
    domain: z.string().min(3),
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
  return project;
});
