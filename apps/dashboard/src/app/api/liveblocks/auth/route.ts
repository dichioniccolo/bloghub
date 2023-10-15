import { and, db, eq, posts, projectMembers } from "@acme/db";
import { ROOM_DIVIDER } from "@acme/lib/constants";
import { getDefaultAvatarImage } from "@acme/lib/utils";

import { $getUser } from "~/app/_api/get-user";
import { liveblocks } from "~/lib/liveblocks";

function getRandomHexColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

export async function POST(request: Request) {
  const user = await $getUser();

  // Create a session for the current user
  // userInfo is made available in Liveblocks presence hooks, e.g. useOthers
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.name ?? user.email,
      color: getRandomHexColor(),
      image: user.image ?? getDefaultAvatarImage(user.name ?? user.email!),
    },
  });

  const { room } = (await request.json()) as { room: string };

  const [projectId, postId] = room.split(ROOM_DIVIDER) as [string, string];

  const post = await db
    .select()
    .from(posts)
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, posts.projectId),
        eq(projectMembers.userId, user.id),
      ),
    )
    .where(and(eq(posts.projectId, projectId), eq(posts.id, postId)))
    .then((x) => x[0]);

  // TODO: Improve this logic
  if (!post) {
    session.allow(room, session.READ_ACCESS);
  } else {
    session.allow(room, session.FULL_ACCESS);
  }

  const { body, status } = await session.authorize();

  return new Response(body, { status });
}
