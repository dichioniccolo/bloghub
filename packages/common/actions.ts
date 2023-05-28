"use server";

import { Role, prisma } from "@acme/db";

import { deleteMedias } from "./external/media/actions";
import { deleteDomain } from "./external/vercel";

export async function deleteProject(project: { id: string; domain: string }) {
  await prisma.$transaction(async (tx) => {
    await deleteDomain(project.domain);

    await tx.project.delete({
      where: {
        id: project.id,
      },
    });
  });
}

export async function getUserTotalUsage(userId: string) {
  const usage = await prisma.visit.count({
    where: {
      project: {
        users: {
          some: {
            role: Role.OWNER,
            userId,
          },
        },
      },
    },
  });

  return usage;
}

export async function getProjectTotalUsage(userId: string, projectId: string) {
  const usage = await prisma.visit.count({
    where: {
      project: {
        id: projectId,
        users: {
          some: {
            userId,
          },
        },
      },
    },
  });

  return usage;
}

export async function getPostTotalUsage(
  userId: string,
  projectId: string,
  postId: string,
) {
  const usage = await prisma.visit.count({
    where: {
      postId,
      project: {
        id: projectId,
        users: {
          some: {
            role: Role.OWNER,
            userId,
          },
        },
      },
    },
  });

  return usage;
}

export async function deleteUnusedMediaInPost(postId: string) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return;
  }

  const media = await prisma.media.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      url: true,
    },
  });

  if (media.length === 0) {
    return;
  }

  // match all html urls with any characters containing the value of env.DO_CDN_URL
  const regex = /<[^>]+src="([^"]+)"/g;

  let match: RegExpExecArray | null;
  const matches: string[] = [];

  while ((match = regex.exec(post.content)) !== null) {
    if (!match[1]) {
      continue;
    }

    matches.push(match[1]);
  }

  const deletedMedias = media.filter((m) => !matches.includes(m.url));

  if (deletedMedias.length === 0) {
    return;
  }

  await deleteMedias(deletedMedias.map((m) => m.url));
  await prisma.media.deleteMany({
    where: {
      id: {
        in: deletedMedias.map((m) => m.id),
      },
    },
  });
}
