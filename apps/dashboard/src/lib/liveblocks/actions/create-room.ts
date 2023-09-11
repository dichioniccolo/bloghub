import { fetchLiveblocksApi } from "..";
import type {
  FetchApiResult,
  Room,
  RoomAccesses,
  RoomMetadata,
} from "../types";

interface CreateRoomRequest {
  id: string;
  metadata?: RoomMetadata;
  usersAccess?: RoomAccesses;
  groupsAccesses?: RoomAccesses;
  defaultAccesses?: string[];
}

/**
 * Create Room
 *
 * Create a new room with a number of params.
 * Uses Liveblocks API
 *
 * @param id - The id of the room
 * @param metadata - The room's metadata
 * @param usersAccesses - Which users are allowed in the room
 * @param groupsAccesses - Which groups are allowed in the room
 * @param defaultAccesses - Default accesses for room
 */
export async function createRoom({
  id,
  metadata,
  usersAccess,
  groupsAccesses,
  defaultAccesses,
}: CreateRoomRequest): Promise<FetchApiResult<Room>> {
  const url = "/v2/rooms";

  const payload = JSON.stringify({
    id,
    metadata,
    usersAccess,
    groupsAccesses,
    defaultAccesses,
  });

  return fetchLiveblocksApi<Room>(url, {
    method: "POST",
    body: payload,
  });
}
