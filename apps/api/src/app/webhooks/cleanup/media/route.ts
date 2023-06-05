import { headers } from "next/headers";
import { Receiver } from "@upstash/qstash/nodejs";

import { deleteMedias } from "@acme/common/external/media/actions";
import { asc, db, inArray, isNull, media, or } from "@acme/db";

import { env } from "~/env.mjs";

const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

export async function POST(req: Request) {
  const body = await req.text();

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

  const medias = await db
    .select({
      id: media.id,
      url: media.url,
    })
    .from(media)
    .where(or(isNull(media.postId), isNull(media.projectId)))
    .orderBy(asc(media.createdAt))
    .limit(100)
    .execute();

  try {
    await deleteMedias(medias.map((x) => x.url));
    await db.delete(media).where(
      inArray(
        media.id,
        medias.map((x) => x.id),
      ),
    );

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
