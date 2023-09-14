import { Liveblocks } from "@liveblocks/node";
import { LIVEBLOCKS_API_URL } from "liveblocks.server.config";

import { env } from "~/env.mjs";
import type { ErrorData, FetchApiResult } from "./types";

export const liveblocks = new Liveblocks({
  secret: env.LIVEBLOCKS_API_KEY,
});

interface ResponseOptions {
  type: "json" | "blob" | "text";
}

/**
 * Fetch Liveblocks API
 *
 * Similar to using normal fetch with the Liveblocks API, with more error checking
 * Add `API_BASE_URL` to `urlEnd`, and `Authorization` header with `SECRET_API_KEY`
 * Uses Liveblocks API
 *
 * @param urlEnd - The part of the URL to attach to the host
 * @param fetchOptions - Fetch options to be used
 */
export async function fetchLiveblocksApi<T = unknown>(
  urlEnd: string,
  fetchOptions?: RequestInit,
  responseOptions: ResponseOptions = {
    type: "json",
  },
): Promise<FetchApiResult<T>> {
  const url = `${LIVEBLOCKS_API_URL}${urlEnd}`;

  try {
    const response = await fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${env.LIVEBLOCKS_API_KEY}`,
      }),
      ...fetchOptions,
    });

    let body;
    if (responseOptions.type === "json") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body = await response.json();
    } else if (responseOptions.type === "blob") {
      body = await response.blob();
    } else if (responseOptions.type === "text") {
      body = await response.text();
    }

    if (!response.ok) {
      if (body.error?.code && body.error?.message && body.error?.suggestion) {
        console.error(body.error);
        return { error: body.error };
      }

      const customError = customLiveblocksErrors[body.error];
      if (customError) {
        console.error(customError);
        return { error: customError };
      }

      const error = {
        code: 500,
        message: `Error when calling ${url}: ${
          body?.error ?? response.statusText
        }`,
        suggestion: "Please try again",
      };
      console.log(error);
      return { error };
    }

    return { data: body };
  } catch (err: any) {
    if (err?.code && err?.message && err?.suggestion) {
      console.error(err);
      return { error: err as ErrorData };
    }

    const customError = customLiveblocksErrors[err];
    if (customError) {
      console.error(customError);
      return { error: customError };
    }

    const error: ErrorData = {
      code: 500,
      message: `Error when calling ${url}`,
      suggestion: "Please try again",
    };
    console.error(error);
    console.error(err);
    return { error };
  }
}

const customLiveblocksErrors: Record<string, ErrorData> = {
  ROOM_NOT_FOUND: {
    code: 404,
    message: "Document not found",
    suggestion: "Please check the URL is correct or the document exists",
  },
};
