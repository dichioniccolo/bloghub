import type { ServerRuntime } from "next";

export { GET, POST } from "@acme/auth";

export const runtime: ServerRuntime = "edge";
