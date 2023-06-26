"use client";

import Link from "next/link";

import { AppRoutes } from "@acme/common/routes";
import {
  isProjectInvitationNotification,
  isRemovedFromProjectNotification,
  type AppNotification,
} from "@acme/notifications";
import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@acme/ui/components/popover";
import { useZact } from "@acme/zact/client";

import { archiveAllNotifications } from "~/app/_actions/notifications/archive-all-notifications";
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

export function NotificationsPopover() {
  const { notifications, unreadCount } = useNotifications();
  const dispatch = useNotificationsDispatch();

  const user = useUser();

  const onNewNotification = (notification: AppNotification) => {
    dispatch({
      type: NotificationActionTypes.ADD_NOTIFICATION,
      payload: notification,
    });
  };

  const { mutate } = useZact(archiveAllNotifications, {
    onSuccess: () => {
      dispatch({
        type: NotificationActionTypes.ARCHIVE_ALL,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payload: {} as any,
      });
    },
  });

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
            <Badge variant="outline" size="sm" className="ml-1">
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
                      />
                    );
                  }

                  if (isRemovedFromProjectNotification(notification)) {
                    return (
                      <RemovedFromProject
                        key={notification.id}
                        notification={notification}
                      />
                    );
                  }

                  return null;
                })}
              </div>
              <div className="sticky bottom-0 flex justify-center border-t border-border p-2">
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => void mutate({})}
                >
                  Archive all
                </Button>
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
