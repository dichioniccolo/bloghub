import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  heading: string;
}>;

export function DashboardHeader({ heading, children }: Props) {
  return (
    <div className="flex h-36 items-center justify-between border-b border-border bg-background">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-wide text-primary">
          {heading}
        </h1>
      </div>
      {children}
    </div>
  );
}
