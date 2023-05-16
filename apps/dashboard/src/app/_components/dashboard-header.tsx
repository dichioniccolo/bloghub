import { type PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  heading: string;
  text?: string;
}>;

export function DashboardHeader({ heading, text, children }: Props) {
  return (
    <div className="flex h-36 items-center justify-between border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-wide text-slate-900">
          {heading}
        </h1>
        {text && <p className="text-neutral-500">{text}</p>}
      </div>
      {children}
    </div>
  );
}
