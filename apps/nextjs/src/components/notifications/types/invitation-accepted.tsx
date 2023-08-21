import { formatDistanceToNow } from "date-fns";
import { UserCheck2 } from "lucide-react";

import type { Notification } from "@acme/db";

import { BaseNotification } from "~/components/notifications/types/base-notification";
import type { AppNotification } from "~/lib/notifications";

interface Props {
  notification: Extract<
    AppNotification,
    { type: typeof Notification.InvitationAccepted }
  >;
}

export function InvitationAccepted({ notification }: Props) {
  return (
    <BaseNotification
      notification={notification}
      icon={<UserCheck2 className="h-6 w-6" />}
    >
      <div className="flex flex-col">
        <div className="text-sm">
          The user{" "}
          <span className="font-bold">{notification.data.userEmail}</span>{" "}
          accepted to join the project {notification.data.projectName}
        </div>
        <span className="text-xs">
          {formatDistanceToNow(new Date(notification.createdAt))} ago
        </span>
      </div>
    </BaseNotification>
  );
}
