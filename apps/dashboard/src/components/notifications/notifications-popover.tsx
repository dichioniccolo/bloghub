"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellRing, Inbox, Settings } from "lucide-react";

import { AppRoutes } from "@acme/lib/routes";
import type { AppNotification } from "@acme/notifications";
import {
  isInvitationAcceptedNotification,
  isProjectInvitationNotification,
  isRemovedFromProjectNotification,
} from "@acme/notifications";
import { Button } from "@acme/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@acme/ui/components/popover";

import { archiveAllNotifications } from "~/app/_actions/notifications/archive-all-notifications";
import {
  NotificationActionTypes,
  useNotifications,
  useNotificationsDispatch,
} from "~/components/notifications/notifications-provider";
import { ProjectInvitationNotification } from "~/components/notifications/types/project-invitation";
import { RemovedFromProject } from "~/components/notifications/types/removed-from-project";
import { useRealtimeNotification } from "~/hooks/use-realtime";
import { useUser } from "~/hooks/use-user";
import { useZact } from "~/lib/zact/client";
import { InvitationAccepted } from "./types/invitation-accepted";

export function NotificationsPopover() {
  const router = useRouter();

  const { notifications, unreadCount } = useNotifications();
  const dispatch = useNotificationsDispatch();

  const user = useUser();

  const [open, setOpen] = useState(false);

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
      });
      router.refresh();
    },
  });

  useRealtimeNotification(user!.id, "notifications:new", onNewNotification);

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
              <Inbox className="h-6 w-6" />
              <span>No new notifications</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
