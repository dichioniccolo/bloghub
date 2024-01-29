"use client";

import { useState } from "react";
import { BellRing, Inbox, Settings } from "lucide-react";

import { AppRoutes } from "@acme/lib/routes";
import {
  isInvitationAcceptedNotification,
  isProjectInvitationNotification,
  isRemovedFromProjectNotification,
} from "@acme/notifications";
import { useServerAction } from "@acme/server-actions/client";
import { Link } from "@acme/ui/components/link";
import { Button } from "@acme/ui/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@acme/ui/components/ui/popover";

import { archiveAllNotifications } from "~/app/_actions/notifications/archive-all-notifications";
import {
  NotificationActionTypes,
  useNotifications,
  useNotificationsDispatch,
} from "~/components/notifications/notifications-provider";
import { ProjectInvitationNotification } from "~/components/notifications/types/project-invitation";
import { RemovedFromProject } from "~/components/notifications/types/removed-from-project";
import { InvitationAccepted } from "./types/invitation-accepted";

// interface Props {
//   session: Session;
// }

export function NotificationsPopover() {
  //  {
  //   session
  //  }: Props
  const { notifications, unreadCount } = useNotifications();
  const dispatch = useNotificationsDispatch();

  const [open, setOpen] = useState(false);

  // const onNewNotification = (notification: AppNotification) => {
  //   dispatch({
  //     type: NotificationActionTypes.ADD_NOTIFICATION,
  //     payload: notification,
  //   });
  // };

  const { action } = useServerAction(archiveAllNotifications, {
    onSuccess: () => {
      dispatch({
        type: NotificationActionTypes.ARCHIVE_ALL,
      });
    },
  });

  // useRealtimeNotification(
  //   session.user.id ?? "",
  //   "notifications:new",
  //   onNewNotification,
  // );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="xs" variant="secondary" className="rounded-full">
          <BellRing className="h-4 w-4" />
          {unreadCount > 0 && (
            <div className="ml-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              {unreadCount}
            </div>
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
            <Link
              href={AppRoutes.NotificationsSettings}
              onClick={() => setOpen(false)}
            >
              <Button size="xs" variant="secondary" className="rounded-full">
                <Settings className="h-4 w-4" />
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

                  if (isInvitationAcceptedNotification(notification)) {
                    return (
                      <InvitationAccepted
                        key={notification.id}
                        notification={notification}
                      />
                    );
                  }

                  return null;
                })}
              </div>
              <div className="sticky bottom-0 flex justify-center border-t border-border p-2">
                <Button formAction={action} size="xs" variant="secondary">
                  Archive all
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center">
              <Inbox className="h-6 w-6" />
              <span>No new notifications</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
