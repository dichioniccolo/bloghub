import { db, eq, posts } from "@acme/db";
import { inngest } from "@acme/inngest";

import { createRoom } from "~/lib/liveblocks/actions/create-room";
import { RoomAccess } from "~/lib/liveblocks/types";
import { getRoom } from "~/lib/utils";

export const convertPostV1TOv2 = inngest.createFunction(
  {
    name: "Convert Post V1 to V2",
  },
  {
    cron: "TZ=Europe/Rome 0 */1 * * *",
  },
  async () => {
    const allV1Posts = await db
      .select()
      .from(posts)
      .where(eq(posts.version, 1));

    for (const post of allV1Posts) {
      await createRoom({
        id: getRoom(post.projectId, post.id),
        groupsAccesses: {
          [post.projectId]: [RoomAccess.RoomWrite],
        },
      });
    }
  },
);
