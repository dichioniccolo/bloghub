import Link from "next/link";
import { Bell } from "lucide-react";

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
import { ProjectInvitationNotification } from "~/app/_components/notifications/types/project-invitation";
import { getNotifications } from "~/lib/shared/api/notifications";

export async function Notifications() {
  const { notifications, unreadCount } = await getNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="xs" variant="secondary" className="rounded-full">
          <Bell className="h-4 w-4" />
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
          <div className="relative block flex-1 divide-y divide-border self-start overflow-y-auto">
            {notifications.map((notification, index) => {
              if (isProjectInvitationNotification(notification)) {
                return (
                  <ProjectInvitationNotification
                    key={index}
                    type={notification.type}
                    data={notification.data}
                    createdAt={notification.createdAt}
                    notificationId={notification.id}
                  />
                );
              }

              if (isRemovedFromProjectNotification(notification)) {
                return "2";
              }

              return null;
            })}
          </div>
          <div className="sticky bottom-0 flex justify-center border-t border-border p-2">
            Archive all
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
