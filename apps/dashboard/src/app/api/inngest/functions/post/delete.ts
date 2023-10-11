import { inngest } from "@acme/inngest";
import { getRoom } from "@acme/lib/utils";

import { deleteRoom } from "~/lib/liveblocks/actions/delete-room";

export const postCreate = inngest.createFunction(
  {
    id: "post/delete",
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
