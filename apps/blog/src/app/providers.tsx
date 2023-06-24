"use client";

import { type PropsWithChildren } from "react";
import { Toaster } from "sonner";

import { TooltipProvider } from "@acme/ui/tooltip";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster closeButton />
    </>
  );
}
