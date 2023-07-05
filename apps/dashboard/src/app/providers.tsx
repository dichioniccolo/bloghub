"use client";

import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";

import { TooltipProvider } from "~/components/ui/tooltip";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster className="dark:hidden" />
      <Toaster className="hidden dark:block" theme="dark"></Toaster>
    </>
  );
}
