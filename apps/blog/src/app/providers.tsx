"use client";

import { type PropsWithChildren } from "react";
import { TooltipProvider } from "@bloghub/ui/components/tooltip";
import { Toaster } from "sonner";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster closeButton />
    </>
  );
}
