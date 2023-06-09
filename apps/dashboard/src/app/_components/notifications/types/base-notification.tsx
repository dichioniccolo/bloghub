"use client";

import { type ReactNode } from "react";

import { Button } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import {
  NotificationActionTypes,
  useNotificationsDispatch,
} from "~/app/_components/notifications/notifications-provider";
import { useUser } from "~/hooks/use-user";
import { archiveNotification } from "~/lib/shared/actions/archive-notification";
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

  const { mutate } = useZact(archiveNotification);

  const onArchive = async () => {
    await mutate({
      notificationId: notification.id,
      userId: user.id,
    });

    dispatch({
      type: NotificationActionTypes.REMOVE_NOTIFICATION,
      payload: notification,
    });
  };

  return (
    <div
      className={cn(
        "group relative flex gap-2 p-2 hover:bg-primary-foreground/90",
        className,
      )}
    >
      <div className="flex w-12 items-center justify-center">{icon}</div>
      <div className="flex-1">{children}</div>
      <div className="invisible flex items-center justify-center transition-all group-hover:visible">
        <Button onClick={onArchive} variant="secondary" size="xs">
          <Icons.archive className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
