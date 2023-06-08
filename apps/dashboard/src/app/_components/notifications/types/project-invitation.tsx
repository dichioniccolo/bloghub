import { type notificationTypeEnum } from "@acme/db";
import { type ProjectInvitationNotificationData } from "@acme/notifications";

import { Icons } from "~/app/_components/icons";

type Props = {
  type: (typeof notificationTypeEnum.enumValues)[0];
  data: ProjectInvitationNotificationData;
};

export function ProjectInvitationNotification({ data }: Props) {
  return (
    <div className="flex gap-2">
      <div className="flex w-12 items-center justify-center">
        <Icons.invitation className="h-6 w-6" />
      </div>
      <div className="text-sm">
        You were invited you to join the project{" "}
        <span className="font-medium">{data.projectName}</span>
      </div>
    </div>
  );
}
