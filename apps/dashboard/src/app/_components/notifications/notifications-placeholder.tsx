import { Bell } from "lucide-react";

import { Button } from "~/components/ui/button";

export function NotificationsPlaceholder() {
  return (
    <Button
      size="xs"
      variant="secondary"
      className="animate-pulse rounded-full"
    >
      <Bell className="mr-1 h-4 w-4" />
      ...
    </Button>
  );
}
