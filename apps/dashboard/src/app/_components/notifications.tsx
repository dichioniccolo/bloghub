import { Bell } from "lucide-react";

import { Button } from "@acme/ui";

import { getNotifications } from "~/lib/shared/api/notifications";

export async function Notifications() {
  const notifications = await getNotifications();

  return (
    <Button size="xs" variant="secondary" className="rounded-full">
      <Bell className="mr-1 h-4 w-4" />
      <span>{notifications.length}</span>
    </Button>
  );
}
