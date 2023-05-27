import { Bell } from "lucide-react";

import { Button } from "@acme/ui";

// eslint-disable-next-line @typescript-eslint/require-await
export async function Notifications() {
  return (
    <Button size="xs" variant="secondary" className="rounded-full">
      <Bell className="mr-1 h-4 w-4" />
      15
    </Button>
  );
}
