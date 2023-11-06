import { unstable_noStore } from "next/cache";

import type { Session } from "@acme/auth";

import { getNotifications } from "~/app/_api/notifications";
import { NotificationsPopover } from "~/components/notifications/notifications-popover";
import { NotificationsProvider } from "~/components/notifications/notifications-provider";

interface Props {
  session: Session;
}

export async function Notifications({ session }: Props) {
  unstable_noStore();
  const { notifications, unreadCount } = await getNotifications();

  return (
    <NotificationsProvider
      value={{
        unreadCount,
        // @ts-expect-error unable to infer type of notification type
        notifications,
      }}
    >
      <NotificationsPopover session={session} />
    </NotificationsProvider>
  );
}
