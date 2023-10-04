import type { ComponentProps } from "react";

import { cn } from "@acme/ui";

type DashboardShellProps = ComponentProps<"div">;

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      {children}
    </div>
  );
}
