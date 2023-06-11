import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { AppRoutes } from "@acme/common/routes";
import { type notificationTypeEnum } from "@acme/db";
import { type AppNotification } from "@acme/notifications";

import { Icons } from "~/app/_components/icons";
import { BaseNotification } from "~/app/_components/notifications/types/base-notification";

type Props = {
  notification: Extract<
    AppNotification,
    { type: (typeof notificationTypeEnum.enumValues)[0] }
  >;
};

export function ProjectInvitationNotification({ notification }: Props) {
  return (
    <BaseNotification
      icon={<Icons.invitation className="h-6 w-6" />}
      notification={notification}
    >
      <Link
        href={AppRoutes.ProjectAcceptInvitation(notification.data.projectId)}
      >
        <div className="flex flex-col">
          <div className="text-sm">
            You were invited you to join the project{" "}
            <span className="font-bold">{notification.data.projectName}</span>
          </div>
          <span className="text-xs">
            {formatDistanceToNow(new Date(notification.createdAt))} ago
          </span>
        </div>
      </Link>
    </BaseNotification>
  );
}
