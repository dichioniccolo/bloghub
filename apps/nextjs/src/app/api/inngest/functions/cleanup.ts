import { asc, db, inArray, isNull, media, or } from "@acme/db";
import { inngest } from "@acme/inngest";

import { deleteMedias } from "~/lib/common/external/media/actions";

export const cleanupFunction = inngest.createFunction(
  {
    name: "Cleanup",
  },
  {
    cron: "TZ=Europe/Rome 0 */12 * * *",
  },
  async () => {
    const mediaList = await db
      .select({
        id: media.id,
        url: media.url,
      })
      .from(media)
      .where(or(isNull(media.postId), isNull(media.projectId)))
      .orderBy(asc(media.createdAt))
      .limit(100);

    if (mediaList.length === 0) {
      return;
    }

    await deleteMedias(mediaList.map((x) => x.url));
    await db.delete(media).where(
      inArray(
        media.id,
        mediaList.map((x) => x.id),
      ),
    );
  },
);
