"use client";

import { useEffect } from "react";

import type { AppNotification } from "@acme/notifications";
import { pusherClient } from "@acme/pusher/client";

export function useRealtimeNotification(
  channel: string,
  event: string,
  handler: (notification: AppNotification) => unknown,
) {
  useEffect(() => {
    pusherClient.subscribe(channel);
    pusherClient.bind(event, handler);

    return () => {
      pusherClient.unsubscribe(channel);
      pusherClient.unbind(event, handler);
    };
  }, [channel, event, handler]);
}
