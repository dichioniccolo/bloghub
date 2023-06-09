import { NotificationsPopover } from "~/app/_components/notifications/notifications-popover";
import { getNotifications } from "~/lib/shared/api/notifications";

export async function Notifications() {
  const notifications = await getNotifications();

  return <NotificationsPopover {...notifications} />;
}
