import { Button } from "@bloghub/ui/components/button";
import { Bell } from "lucide-react";

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
