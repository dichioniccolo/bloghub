import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

import type { Notification } from "@bloghub/db";

import { BaseNotification } from "~/components/notifications/types/base-notification";
import type { AppNotification } from "~/lib/notifications";

type Props = {
  notification: Extract<
    AppNotification,
    { type: typeof Notification.RemovedFromProject }
  >;
};

export function RemovedFromProject({ notification }: Props) {
  return (
    <BaseNotification
      notification={notification}
      icon={<Trash2 className="h-6 w-6" />}
    >
      <div className="flex flex-col">
        <div className="text-sm">
          You were removed from project{" "}
          <span className="font-bold">{notification.data.projectName}</span>
        </div>
        <span className="text-xs">
          {formatDistanceToNow(new Date(notification.createdAt))} ago
        </span>
      </div>
    </BaseNotification>
  );
}
