"use client";

import { type PropsWithChildren } from "react";

import { ThemeProvider, Toaster, TooltipProvider } from "@acme/ui";

// type Props = never;

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class">
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </ThemeProvider>
  );
}
