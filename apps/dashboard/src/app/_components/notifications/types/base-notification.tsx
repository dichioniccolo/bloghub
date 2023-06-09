"use client";

import { type ReactNode } from "react";

import { Button } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { archiveNotification } from "~/lib/shared/actions/archive-notification";
import { cn } from "~/lib/utils";
import { useZact } from "~/lib/zact/client";

type Props = {
  notificationId: number;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

export function BaseNotification({
  notificationId,
  icon,
  children,
  className,
}: Props) {
  const user = useUser();

  const { mutate, isRunning } = useZact(archiveNotification);

  if (isRunning) {
    return null;
  }

  return (
    <div className={cn("group relative flex gap-2 p-2", className)}>
      <div className="flex w-12 items-center justify-center">{icon}</div>
      <div className="flex-1">{children}</div>
      <div className="invisible flex items-center justify-center transition-all group-hover:visible">
        <Button
          onClick={() =>
            mutate({
              notificationId,
              userId: user.id,
            })
          }
          variant="secondary"
          size="xs"
        >
          <Icons.archive className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
