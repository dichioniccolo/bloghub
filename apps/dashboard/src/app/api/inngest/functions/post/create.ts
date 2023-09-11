import { inngest } from "@acme/inngest";

import { createRoom } from "~/lib/liveblocks/actions/create-room";
import { RoomAccess } from "~/lib/liveblocks/types";
import { getRoom } from "~/lib/utils";

export const postCreate = inngest.createFunction(
  {
    name: "Create Post",
  },
  {
    event: "post/create",
  },
  async ({ event, step }) => {
    await step.run("Create Room", async () => {
      await createRoom({
        id: getRoom(event.data.projectId, event.data.postId),
        groupsAccesses: {
          [event.data.projectId]: [RoomAccess.RoomWrite],
        },
      });
    });
  },
);
