import { formatDistanceToNow } from "date-fns";

import { type RemovedFromProjectNotificationData } from "@acme/notifications";

import { Icons } from "~/app/_components/icons";
import { BaseNotification } from "~/app/_components/notifications/types/base-notification";
import { type Notification } from "~/lib/shared/api/notifications";

type Props = {
  notification: Notification;
  data: RemovedFromProjectNotificationData;
};

export function RemovedFromProject({ notification, data }: Props) {
  return (
    <BaseNotification
      notification={notification}
      icon={<Icons.delete className="h-6 w-6" />}
    >
      <div className="flex flex-col">
        <div className="text-sm">
          You were removed from project{" "}
          <span className="font-bold">{data.projectName}</span>
        </div>
        <span className="text-xs">
          {formatDistanceToNow(new Date(notification.createdAt))} ago
        </span>
      </div>
    </BaseNotification>
  );
}
