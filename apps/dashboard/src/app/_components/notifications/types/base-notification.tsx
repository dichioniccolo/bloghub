"use client";

import { type ReactNode } from "react";
import Link, { type LinkProps } from "next/link";

import { Button } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { cn } from "~/lib/utils";

type Props = {
  notificationId: number;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
} & LinkProps;

export function BaseNotification({
  notificationId,
  icon,
  children,
  className,
  ...props
}: Props) {
  return (
    <Link {...props} className={cn("group relative flex gap-2 p-2", className)}>
      <div className="flex w-12 items-center justify-center">{icon}</div>
      {children}
      <div className="invisible flex items-center justify-center transition-all group-hover:visible">
        <Button variant="secondary" size="xs">
          <Icons.archive className="h-4 w-4" />
        </Button>
      </div>
    </Link>
  );
}
