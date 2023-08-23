"use client";

import { useEffect } from "react";

import type { AppNotification } from "@acme/notifications";

import { pusherClient } from "~/lib/pusher";

export function useRealtimeNotification(
  channel: string,
  event: string,
  handler: (notification: AppNotification) => unknown,
) {
  useEffect(() => {
    pusherClient.subscribe(channel);
    pusherClient.bind(event, handler);

    return () => {
      pusherClient.unbind(event, handler);
      pusherClient.unsubscribe(channel);
    };
  }, [channel, event, handler]);
}
