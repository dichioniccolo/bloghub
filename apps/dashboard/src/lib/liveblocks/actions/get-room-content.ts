import { fetchLiveblocksApi } from "..";
import type { FetchApiResult } from "../types";

interface GetRoomContentRequest {
  roomId: string;
}

export async function getRoomContent({
  roomId,
}: GetRoomContentRequest): Promise<FetchApiResult<unknown>> {
  const url = `/v2/rooms/${roomId}/ydoc`;

  return fetchLiveblocksApi<unknown>(url, {
    method: "GET",
  });
}
