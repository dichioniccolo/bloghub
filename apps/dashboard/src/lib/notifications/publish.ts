"use server";

import { createId } from "@paralleldrive/cuid2";

import { qstashClient } from "~/lib/qstash";
import { type AppNotification } from "../notifications";

export async function publishNotification<T extends AppNotification["type"]>(
  type: T,
  data?: Extract<AppNotification, { type: T }>["data"],
) {
  await qstashClient.publishJSON({
    topic: "notifications",
    body: {
      id: createId(),
      type,
      data,
    },
    delay: 2,
  });
}
