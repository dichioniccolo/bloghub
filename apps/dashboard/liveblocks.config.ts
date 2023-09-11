import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

import type { User } from "@acme/db";

export type UserInfo = Pick<User, "name" | "image"> & {
  color: string;
};

const client = createClient({
  // publicApiKey: env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
  authEndpoint: "/api/liveblocks/auth",
  // throttle: 100,
});

// Presence represents the properties that exist on every user in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Presence = {
  cursor: { x: number; y: number } | null;
};

// Optionally, Storage represents the shared document that persists in the
// Room, even after all users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Storage = {
  // author: LiveObject<{ firstName: string, lastName: string }>,
  // ...
};

// Optionally, UserMeta represents static/readonly metadata on each user, as
// provided by your own custom auth back end (if used). Useful for data that
// will not change during a session, like a user's name or avatar.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type UserMeta = {
  id: string;
  info: UserInfo;
};

// Optionally, the type of custom events broadcast and listened to in this
// room. Use a union for multiple events. Must be JSON-serializable.
type RoomEvent =
  | {
      type: "POST_PUBLISHED";
    }
  | {
      type: "POST_UNPUBLISHED";
    };

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
