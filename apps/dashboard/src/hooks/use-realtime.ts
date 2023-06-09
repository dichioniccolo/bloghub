"use client";

import { useEffect } from "react";

import { pusherClient } from "~/lib/pusher";
import { type Notification } from "~/lib/shared/api/notifications";

export function useRealtimeNotification<T>(
  channel: string,
  event: string,
  handler: (notification: Notification) => T,
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
