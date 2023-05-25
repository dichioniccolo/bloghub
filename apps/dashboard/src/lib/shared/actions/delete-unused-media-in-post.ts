"use server";

import { deleteMedias } from "@acme/common/external/media/actions";
import { prisma } from "@acme/db";

export const deleteUnusedMediaInPost = async (postId: string) => {
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
};
