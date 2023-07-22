"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";

import { TooltipProvider } from "~/components/ui/tooltip";

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: "light" | "dark" | "system";
  };

  return <Toaster theme={theme} />;
};

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class">
      <ToasterProvider />
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
