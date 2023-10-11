import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MailPlus } from "lucide-react";

import type { Notification } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import type { AppNotification } from "@acme/notifications";

import { BaseNotification } from "~/components/notifications/types/base-notification";

interface Props {
  notification: Extract<
    AppNotification,
    { type: typeof Notification.ProjectInvitation }
  >;
}

export function ProjectInvitationNotification({ notification }: Props) {
  return (
    <BaseNotification
      icon={<MailPlus className="h-6 w-6" />}
      notification={notification}
    >
      <Link
        href={AppRoutes.ProjectAcceptInvitation(notification.data.projectId)}
      >
        <div className="flex flex-col items-start">
          <div className="text-left text-sm">
            You were invited you to join the project{" "}
            <span className="font-bold">{notification.data.projectName}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt))} ago
          </span>
        </div>
      </Link>
    </BaseNotification>
  );
}
