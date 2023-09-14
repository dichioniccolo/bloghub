import { fetchLiveblocksApi } from "..";
import type { FetchApiResult } from "../types";

interface UpdateRoomContentRequest {
  roomId: string;
  binary: Uint8Array;
}

export async function updateRoomContent({
  roomId,
  binary,
}: UpdateRoomContentRequest): Promise<FetchApiResult<{ status: number }>> {
  const url = `/v2/rooms/${roomId}/ydoc`;

  return fetchLiveblocksApi<{ status: number }>(
    url,
    {
      method: "PUT",
      body: binary,
    },
    {
      type: "json",
    },
  );
}
