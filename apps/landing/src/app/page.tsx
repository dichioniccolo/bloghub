import type { ServerRuntime } from "next";

export const runtime: ServerRuntime = "edge";

export default function Page() {
  return <div></div>;
}
