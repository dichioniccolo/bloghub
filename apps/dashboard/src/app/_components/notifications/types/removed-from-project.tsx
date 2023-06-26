import { type Notification } from "@bloghub/db";
import { type AppNotification } from "@bloghub/notifications";
import { formatDistanceToNow } from "date-fns";

import { Icons } from "~/app/_components/icons";
import { BaseNotification } from "~/app/_components/notifications/types/base-notification";

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
      icon={<Icons.delete className="h-6 w-6" />}
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
