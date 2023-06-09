import { NotificationsPopover } from "~/app/_components/notifications/notifications-popover";
import { NotificationsProvider } from "~/app/_components/notifications/notifications-provider";
import { getNotifications } from "~/lib/shared/api/notifications";

export async function Notifications() {
  const notifications = await getNotifications();

  return (
    <NotificationsProvider value={notifications}>
      <NotificationsPopover />
    </NotificationsProvider>
  );
}
