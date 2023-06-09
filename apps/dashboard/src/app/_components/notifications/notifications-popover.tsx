"use client";

import Link from "next/link";

import { AppRoutes } from "@acme/common/routes";
import {
  isProjectInvitationNotification,
  isRemovedFromProjectNotification,
} from "@acme/notifications";
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import {
  NotificationActionTypes,
  useNotifications,
  useNotificationsDispatch,
} from "~/app/_components/notifications/notifications-provider";
import { ProjectInvitationNotification } from "~/app/_components/notifications/types/project-invitation";
import { RemovedFromProject } from "~/app/_components/notifications/types/removed-from-project";
import { useRealtimeNotification } from "~/hooks/use-realtime";
import { useUser } from "~/hooks/use-user";
import { type Notification } from "~/lib/shared/api/notifications";

export function NotificationsPopover() {
  const { notifications, unreadCount } = useNotifications();
  const dispatch = useNotificationsDispatch();

  const user = useUser();

  const onNewNotification = (notification: Notification) => {
    dispatch({
      type: NotificationActionTypes.ADD_NOTIFICATION,
      payload: notification,
    });
  };

  useRealtimeNotification(
    `user__${user.id}`,
    "notifications",
    onNewNotification,
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="xs" variant="secondary" className="rounded-full">
          <Icons.bellRing className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge variant="info" size="sm" className="ml-1">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="h-[500px] w-[400px] overflow-hidden p-0"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-2">
            <div className="text-sm font-medium">Notifications</div>
            <Link href={AppRoutes.NotificationsSettings}>
              <Button size="xs" variant="secondary" className="rounded-full">
                <Icons.settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {notifications.length > 0 ? (
            <>
              <div className="relative block flex-1 divide-y divide-border overflow-y-auto">
                {notifications.map((notification) => {
                  if (isProjectInvitationNotification(notification)) {
                    return (
                      <ProjectInvitationNotification
                        key={notification.id}
                        notification={notification}
                        data={notification.data}
                      />
                    );
                  }

                  if (isRemovedFromProjectNotification(notification)) {
                    return (
                      <RemovedFromProject
                        key={notification.id}
                        notification={notification}
                        data={notification.data}
                      />
                    );
                  }

                  return null;
                })}
              </div>
              <div className="sticky bottom-0 flex justify-center border-t border-border p-2">
                Archive all
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center">
              <Icons.inbox className="h-6 w-6" />
              <span>No new notifications</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
