import { fetchLiveblocksApi } from "..";
import type { FetchApiResult } from "../types";

interface GetRoomContentRequest {
  roomId: string;
}

export async function getRoomContent({
  roomId,
}: GetRoomContentRequest): Promise<FetchApiResult<Blob>> {
  const url = `/v2/rooms/${roomId}/ydoc-binary`;

  return fetchLiveblocksApi<Blob>(
    url,
    {
      method: "GET",
    },
    {
      type: "blob",
    },
  );
}
