import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { AppRoutes } from "@acme/common/routes";
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
      icon={<Icons.invitation className="h-6 w-6" />}
      notification={notification}
    >
      <Link href={AppRoutes.ProjectAcceptInvitation(data.projectId)}>
        <div className="flex flex-col">
          <div className="text-sm">
            You were invited you to join the project{" "}
            <span className="font-bold">{data.projectName}</span>
          </div>
          <span className="text-xs">
            {formatDistanceToNow(new Date(notification.createdAt))} ago
          </span>
        </div>
      </Link>
    </BaseNotification>
  );
}
