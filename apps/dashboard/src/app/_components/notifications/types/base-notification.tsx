"use client";

import { type ReactNode } from "react";

import { type AppNotification } from "@acme/notifications";
import { Button } from "@acme/ui";
import { useZact } from "@acme/zact/client";

import { Icons } from "~/app/_components/icons";
import {
  NotificationActionTypes,
  useNotificationsDispatch,
} from "~/app/_components/notifications/notifications-provider";
import { useUser } from "~/hooks/use-user";
import { archiveNotification } from "~/lib/shared/actions/notifications/archive-notification";
import { markNotificationAsRead } from "~/lib/shared/actions/notifications/mark-notification-as-read";
import { cn } from "~/lib/utils";

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

  const user = useUser();

  const { mutate: archive } = useZact(archiveNotification, {
    onSuccess: () => {
      dispatch({
        type: NotificationActionTypes.REMOVE_NOTIFICATION,
        payload: notification,
      });
    },
  });
  const { mutate: markAsRead } = useZact(markNotificationAsRead);

  const onArchive = async () => {
    await archive({
      notificationId: notification.id,
      userId: user.id,
    });
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
        "group relative flex h-20 cursor-pointer gap-2 px-2 hover:bg-primary-foreground/90",
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
