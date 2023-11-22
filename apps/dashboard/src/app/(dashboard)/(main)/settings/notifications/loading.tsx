import { Separator } from "@acme/ui/components/separator";
import { Skeleton } from "@acme/ui/components/skeleton";

import { NotificationsForm } from "./notifications-form";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications.
        </p>
      </div>
      <Separator />
      <Skeleton>
        <NotificationsForm
          settings={{
            security: true,
            communication: false,
            marketing: false,
            social: false,
          }}
        />
      </Skeleton>
    </div>
  );
}
