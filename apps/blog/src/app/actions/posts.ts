"use server";

import { prisma } from "@acme/db";

export async function getPostBySlug(domain: string, slug: string) {
  return await prisma.post.findFirst({
    where: {
      slug,
      project: {
        domain,
      },
    },
    select: {
      title: true,
      contentHtml: true,
      createdAt: true,
    },
  });
}
