import { inngest } from "@acme/inngest";
import { getRoom } from "@acme/lib/utils";

import { createRoom } from "~/lib/liveblocks/actions/create-room";
import { RoomAccess } from "~/lib/liveblocks/types";

export const postCreate = inngest.createFunction(
  {
    id: "post/create",
    name: "Create Post",
  },
  {
    event: "post/create",
  },
  async ({ event, step }) => {
    await step.run("Create Room", async () => {
      await createRoom({
        id: getRoom(event.data.projectId, event.data.postId),
        defaultAccesses: [RoomAccess.RoomWrite],
        groupsAccesses: {
          [event.data.projectId]: [RoomAccess.RoomWrite],
        },
      });
    });
  },
);
