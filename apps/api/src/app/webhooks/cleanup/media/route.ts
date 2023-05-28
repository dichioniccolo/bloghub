import { headers } from "next/headers";
import { Receiver } from "@upstash/qstash/nodejs";

import { deleteMedias } from "@acme/common/external/media/actions";
import { prisma } from "@acme/db";

import { env } from "~/env.mjs";

const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();

  const signature = headers().get("Upstash-Signature") ?? "";

  const valid = await receiver.verify({
    signature,
    body,
  });

  if (!valid) {
    return new Response(null, {
      status: 401,
    });
  }

  const medias = await prisma.media.findMany({
    where: {
      OR: [
        {
          postId: null,
        },
        {
          projectId: null,
        },
      ],
    },
    select: {
      id: true,
      url: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 100,
  });

  try {
    await deleteMedias(medias.map((media) => media.url));
    await prisma.media.deleteMany({
      where: {
        id: {
          in: medias.map((media) => media.id),
        },
      },
    });

    return new Response(null, {
      status: 200,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return new Response(e?.message, {
      status: 500,
    });
  }
}
