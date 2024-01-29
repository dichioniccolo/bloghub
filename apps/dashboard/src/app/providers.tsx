"use client";

import type { PropsWithChildren } from "react";

import { Toaster } from "@acme/ui/components/ui/sonner";
import { TooltipProvider } from "@acme/ui/components/ui/tooltip";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <Toaster />
      <TooltipProvider>{children}</TooltipProvider>
    </>
  );
}
