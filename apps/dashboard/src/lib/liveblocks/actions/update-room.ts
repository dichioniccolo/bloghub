import { fetchLiveblocksApi } from "..";
import type { FetchApiResult, Room } from "../types";

interface UpdateRoomRequest {
  roomId: Room["id"];
  metadata?: Room["metadata"];
  usersAccess?: Room["usersAccesses"];
  groupsAccesses?: Room["groupsAccesses"];
  defaultAccesses?: Room["defaultAccesses"];
}

/**
 * Update Room
 *
 * Get the room by the room's id
 * Uses Liveblocks API
 *
 * @param roomId - The id/name of the room
 * @param metadata - The room's metadata object
 * @param usersAccesses - The room's user accesses
 * @param groupsAccesses - The room's group accesses
 * @param defaultAccesses - The default access value
 */
export async function updateRoom({
  roomId,
  metadata,
  usersAccess,
  groupsAccesses,
  defaultAccesses,
}: UpdateRoomRequest): Promise<FetchApiResult<Room>> {
  const url = `/v2/rooms/${roomId}`;

  let payload = {};

  if (metadata) {
    payload = { ...payload, metadata };
  }

  if (usersAccess) {
    payload = { ...payload, usersAccess };
  }

  if (groupsAccesses) {
    payload = { ...payload, groupsAccesses };
  }

  if (defaultAccesses) {
    payload = { ...payload, defaultAccesses };
  }

  return fetchLiveblocksApi<Room>(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
