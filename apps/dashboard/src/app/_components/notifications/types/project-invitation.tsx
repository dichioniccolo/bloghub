import { formatDistanceToNow } from "date-fns";

import { AppRoutes } from "@acme/common/routes";
import { type notificationTypeEnum } from "@acme/db";
import { type ProjectInvitationNotificationData } from "@acme/notifications";

import { Icons } from "~/app/_components/icons";
import { BaseNotification } from "~/app/_components/notifications/types/base-notification";

type Props = {
  notificationId: number;
  type: (typeof notificationTypeEnum.enumValues)[0];
  data: ProjectInvitationNotificationData;
  createdAt: Date;
};

export function ProjectInvitationNotification({
  notificationId,
  data,
  createdAt,
}: Props) {
  return (
    <BaseNotification
      href={AppRoutes.ProjectAcceptInvitation(data.projectId)}
      icon={<Icons.invitation className="h-6 w-6" />}
      notificationId={notificationId}
    >
      <div className="flex flex-col">
        <div className="text-sm">
          You were invited you to join the project{" "}
          <span className="font-bold">{data.projectName}</span>
        </div>
        <span className="text-xs">{formatDistanceToNow(createdAt)} ago</span>
      </div>
    </BaseNotification>
  );
}
