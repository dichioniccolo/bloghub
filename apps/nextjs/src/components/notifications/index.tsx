import { NotificationsPopover } from "~/components/notifications/notifications-popover";
import { NotificationsProvider } from "~/components/notifications/notifications-provider";
import { getNotifications } from "~/app/_api/notifications";

export async function Notifications() {
  const notifications = await getNotifications();

  return (
    <NotificationsProvider value={notifications}>
      <NotificationsPopover />
    </NotificationsProvider>
  );
}
