import { inngest } from "@acme/inngest";

import { deleteRoom } from "~/lib/liveblocks/actions/delete-room";
import { getRoom } from "~/lib/utils";

export const postCreate = inngest.createFunction(
  {
    name: "Delete Post",
  },
  {
    event: "post/delete",
  },
  async ({ event, step }) => {
    await step.run("Delete Room", async () => {
      await deleteRoom({
        roomId: getRoom(event.data.projectId, event.data.postId),
      });
    });
  },
);
