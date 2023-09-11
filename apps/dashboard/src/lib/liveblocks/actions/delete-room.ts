import { fetchLiveblocksApi } from "..";
import type { FetchApiResult, Room } from "../types";

interface DeleteRoomRequest {
  roomId: string;
}

/**
 * Delete Room
 *
 * Delete the room by the room's id
 * Uses Liveblocks API
 *
 * @param roomId - The id of the room
 */
export async function deleteRoom({
  roomId,
}: DeleteRoomRequest): Promise<FetchApiResult<Room>> {
  const url = `/v2/rooms/${roomId}`;

  return fetchLiveblocksApi<Room>(url, {
    method: "DELETE",
  });
}
