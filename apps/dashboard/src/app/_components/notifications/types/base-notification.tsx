"use client";

import { type MouseEventHandler, type ReactNode } from "react";

import { type AppNotification } from "@acme/notifications";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { useZact } from "@acme/zact/client";

import { archiveNotification } from "~/app/_actions/notifications/archive-notification";
import { markNotificationAsRead } from "~/app/_actions/notifications/mark-notification-as-read";
import { Icons } from "~/app/_components/icons";
import {
  NotificationActionTypes,
  useNotificationsDispatch,
} from "~/app/_components/notifications/notifications-provider";

type Props = {
  notification: AppNotification;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

export function BaseNotification({
  notification,
  icon,
  children,
  className,
}: Props) {
  const dispatch = useNotificationsDispatch();

  const { mutate: archive } = useZact(archiveNotification, {
    onSuccess: () => {
      dispatch({
        type: NotificationActionTypes.REMOVE_NOTIFICATION,
        payload: notification,
      });
    },
  });
  const { mutate: markAsRead } = useZact(markNotificationAsRead, {
    onBeforeAction: () => {
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

  const onArchive: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    await archive({
      notificationId: notification.id,
    });
  };

  const onInteract = () =>
    markAsRead({
      notificationId: notification.id,
    });

  return (
    <div
      className={cn(
        "group relative flex h-20 cursor-pointer gap-2 px-2 hover:bg-primary-foreground/90",
        className,
      )}
      onClick={onInteract}
    >
      <div className="flex w-12 items-center justify-center">{icon}</div>
      <div className="flex flex-1 items-center">{children}</div>
      <div className="invisible flex items-center justify-center transition-all group-hover:visible">
        <Button onClick={onArchive} variant="secondary" size="xs">
          <Icons.archive className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
