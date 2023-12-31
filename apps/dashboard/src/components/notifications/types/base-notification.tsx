"use client";

import type { MouseEvent, ReactNode } from "react";
import { Archive } from "lucide-react";

import type { AppNotification } from "@acme/notifications";
import { useServerAction } from "@acme/server-actions/client";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/components/ui/button";

import { archiveNotification } from "~/app/_actions/notifications/archive-notification";
import { markNotificationAsRead } from "~/app/_actions/notifications/mark-notification-as-read";
import {
  NotificationActionTypes,
  useNotificationsDispatch,
} from "~/components/notifications/notifications-provider";

interface Props {
  notification: AppNotification;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function BaseNotification({
  notification,
  icon,
  children,
  className,
}: Props) {
  const dispatch = useNotificationsDispatch();

  const { action: archive } = useServerAction(archiveNotification, {
    onSuccess: () => {
      dispatch({
        type: NotificationActionTypes.REMOVE_NOTIFICATION,
        payload: notification,
      });
    },
  });
  const { action: markAsRead } = useServerAction(markNotificationAsRead, {
    onSuccess: () => {
      // TODO: make it with optimistic
      dispatch({
        type: NotificationActionTypes.MARK_AS_READ,
        payload: notification,
      });
    },
    onServerError: () => {
      dispatch({
        type: NotificationActionTypes.MARK_AS_UNREAD,
        payload: notification,
      });
    },
  });

  const onArchive = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    archive({
      notificationId: notification.id,
    });
  };

  const onInteract = () =>
    markAsRead({
      notificationId: notification.id,
    });

  return (
    <button
      type="button"
      className={cn(
        "group relative flex h-20 w-full cursor-pointer items-center gap-2 hover:bg-primary-foreground/90",
        className,
      )}
      onClick={onInteract}
    >
      <div className="flex h-full w-12 items-center justify-center">{icon}</div>
      <div className="flex flex-1">{children}</div>
      <div className="invisible flex w-12 items-center justify-center transition-all group-hover:visible">
        <Button onClick={onArchive} variant="secondary" size="xs">
          <Archive className="h-4 w-4" />
        </Button>
      </div>
    </button>
  );
}
