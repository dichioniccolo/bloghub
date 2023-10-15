import type { ServerRuntime } from "next";

import { authHandlers } from "~/lib/auth";

export const runtime: ServerRuntime = "edge";

export const { GET, POST } = authHandlers;
