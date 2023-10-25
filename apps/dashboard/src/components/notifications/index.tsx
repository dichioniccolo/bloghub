import type { Session } from "@acme/auth";

import { getNotifications } from "~/app/_api/notifications";
import { NotificationsPopover } from "~/components/notifications/notifications-popover";
import { NotificationsProvider } from "~/components/notifications/notifications-provider";

interface Props {
  session: Session;
}

export async function Notifications({ session }: Props) {
  const notifications = await getNotifications();

  return (
    <NotificationsProvider value={notifications}>
      <NotificationsPopover session={session} />
    </NotificationsProvider>
  );
}
