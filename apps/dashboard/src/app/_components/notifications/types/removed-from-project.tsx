import { formatDistanceToNow } from "date-fns";

import { type notificationTypeEnum } from "@acme/db";
import { type RemovedFromProjectNotificationData } from "@acme/notifications";

import { Icons } from "~/app/_components/icons";
import { BaseNotification } from "~/app/_components/notifications/types/base-notification";

type Props = {
  notificationId: number;
  type: (typeof notificationTypeEnum.enumValues)[1];
  data: RemovedFromProjectNotificationData;
  createdAt: Date;
};

export function RemovedFromProject({ notificationId, data, createdAt }: Props) {
  return (
    <BaseNotification
      notificationId={notificationId}
      icon={<Icons.delete className="h-6 w-6" />}
    >
      <div className="flex flex-col">
        <div className="text-sm">
          You were removed from project{" "}
          <span className="font-bold">{data.projectName}</span>
        </div>
        <span className="text-xs">{formatDistanceToNow(createdAt)} ago</span>
      </div>
    </BaseNotification>
  );
}
