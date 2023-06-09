import { formatDistanceToNow } from "date-fns";

import { type ProjectInvitationNotificationData } from "@acme/notifications";

import { Icons } from "~/app/_components/icons";
import { BaseNotification } from "~/app/_components/notifications/types/base-notification";
import { type Notification } from "~/lib/shared/api/notifications";

type Props = {
  notification: Notification;
  data: ProjectInvitationNotificationData;
};

export function ProjectInvitationNotification({ notification, data }: Props) {
  return (
    <BaseNotification
      // href={AppRoutes.ProjectAcceptInvitation(data.projectId)}
      icon={<Icons.invitation className="h-6 w-6" />}
      notification={notification}
    >
      <div className="flex flex-col">
        <div className="text-sm">
          You were invited you to join the project{" "}
          <span className="font-bold">{data.projectName}</span>
        </div>
        <span className="text-xs">
          {formatDistanceToNow(notification.createdAt)} ago
        </span>
      </div>
    </BaseNotification>
  );
}
