import { getNotifications } from "~/app/_api/notifications";
import { NotificationsPopover } from "~/app/_components/notifications/notifications-popover";
import { NotificationsProvider } from "~/app/_components/notifications/notifications-provider";

export async function Notifications() {
  const notifications = await getNotifications();

  return (
    <NotificationsProvider value={notifications}>
      <NotificationsPopover />
    </NotificationsProvider>
  );
}
