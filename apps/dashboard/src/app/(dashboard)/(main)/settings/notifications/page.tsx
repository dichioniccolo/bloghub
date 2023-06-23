import { type Metadata } from "next";

import { Separator } from "@acme/ui";

import { getNotificationsSettings } from "~/app/_api/settings";
import { NotificationsForm } from "./notifications-form";

export const metadata = {
  title: "Notifications Settings",
} satisfies Metadata;

export default async function Page() {
  const notificationsSettings = await getNotificationsSettings();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications.
        </p>
      </div>
      <Separator />
      <NotificationsForm settings={notificationsSettings} />
    </div>
  );
}
