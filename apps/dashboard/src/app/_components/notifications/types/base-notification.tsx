"use client";

import { type ReactNode } from "react";

import { Button } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import {
  NotificationActionTypes,
  useNotificationsDispatch,
} from "~/app/_components/notifications/notifications-provider";
import { useUser } from "~/hooks/use-user";
import { archiveNotification } from "~/lib/shared/actions/notifications/archive-notification";
import { markNotificationAsRead } from "~/lib/shared/actions/notifications/mark-notification-as-read";
import { type Notification } from "~/lib/shared/api/notifications";
import { cn } from "~/lib/utils";
import { useZact } from "~/lib/zact/client";

type Props = {
  notification: Notification;
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

  const user = useUser();

  const { mutate: archive } = useZact(archiveNotification);
  const { mutate: markAsRead } = useZact(markNotificationAsRead);

  const onArchive = async () => {
    dispatch({
      type: NotificationActionTypes.REMOVE_NOTIFICATION,
      payload: notification,
    });

    try {
      await archive({
        notificationId: notification.id,
        userId: user.id,
      });
    } catch {
      dispatch({
        type: NotificationActionTypes.ADD_NOTIFICATION,
        payload: notification,
      });
    }
  };

  const onInteract = async () => {
    dispatch({
      type: NotificationActionTypes.MARK_AS_READ,
      payload: notification,
    });

    try {
      await markAsRead({
        notificationId: notification.id,
        userId: user.id,
      });
    } catch {
      dispatch({
        type: NotificationActionTypes.MARK_AS_UNREAD,
        payload: notification,
      });
    }
  };

  return (
    <div
      className={cn(
        "group relative flex h-20 gap-2 px-2 hover:bg-primary-foreground/90 cursor-pointer",
        className,
      )}
      onClick={onInteract}
    >
      <div className="flex w-12 items-center justify-center">{icon}</div>
      <div className="flex flex-1 items-center">{children}</div>
      <div className="invisible flex items-center justify-center transition-all group-hover:visible">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            void onArchive();
          }}
          variant="secondary"
          size="xs"
        >
          <Icons.archive className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
