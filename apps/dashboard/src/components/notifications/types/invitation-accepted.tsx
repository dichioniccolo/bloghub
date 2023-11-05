import { formatDistanceToNow } from "date-fns";
import { UserCheck2 } from "lucide-react";

import type { NotificationType } from "@acme/db";
import type { AppNotification } from "@acme/notifications";

import { BaseNotification } from "~/components/notifications/types/base-notification";

interface Props {
  notification: Extract<
    AppNotification,
    { type: typeof NotificationType.INVITATION_ACCEPTED }
  >;
}

export function InvitationAccepted({ notification }: Props) {
  return (
    <BaseNotification
      notification={notification}
      icon={<UserCheck2 className="h-6 w-6" />}
    >
      <div className="flex flex-col items-start">
        <div className="text-left text-sm">
          The user{" "}
          <span className="font-bold">{notification.body.userEmail}</span>{" "}
          accepted to join the project {notification.body.projectName}
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt))} ago
        </span>
      </div>
    </BaseNotification>
  );
}
