import type { ServerRuntime } from "next";
import { redirect } from "next/navigation";

import { env } from "~/env.mjs";

export const runtime: ServerRuntime = "edge";

export default function Page() {
  redirect(`https://app.${env.NEXT_PUBLIC_APP_DOMAIN}`);
}
