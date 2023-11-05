import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

import type { NotificationType } from "@acme/db";
import type { AppNotification } from "@acme/notifications";

import { BaseNotification } from "~/components/notifications/types/base-notification";

interface Props {
  notification: Extract<
    AppNotification,
    { type: typeof NotificationType.REMOVED_FROM_PROJECT }
  >;
}

export function RemovedFromProject({ notification }: Props) {
  return (
    <BaseNotification
      notification={notification}
      icon={<Trash2 className="h-6 w-6" />}
    >
      <div className="flex flex-col items-start">
        <div className="text-left text-sm">
          You were removed from project{" "}
          <span className="font-bold">{notification.body.projectName}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt))} ago
        </span>
      </div>
    </BaseNotification>
  );
}
