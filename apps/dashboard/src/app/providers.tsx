"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@acme/ui/components/ui/sonner";
import { TooltipProvider } from "@acme/ui/components/ui/tooltip";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class">
      <Toaster />
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
