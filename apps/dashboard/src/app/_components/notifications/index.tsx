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
          <Bell className="mr-1 h-4 w-4" />
          {unreadCount > 0 && (
            <Badge variant="info" size="sm">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="h-96 w-80">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Notifications</div>
          <Link href={AppRoutes.NotificationsSettings}>
            <Button size="xs" variant="secondary" className="rounded-full">
              <Icons.settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {notifications.map((notification, index) => {
            if (isProjectInvitationNotification(notification)) {
              return (
                <ProjectInvitationNotification
                  key={index}
                  type={notification.type}
                  data={notification.data}
                />
              );
            }

            if (isRemovedFromProjectNotification(notification)) {
              return "2";
            }

            return null;
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
