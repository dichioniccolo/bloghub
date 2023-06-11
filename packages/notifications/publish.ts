"use server";

import { createId } from "@paralleldrive/cuid2";

import { type AppNotification } from "./index";
import { qstashClient } from "./lib/client";

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
    delay: 10,
  });
}
