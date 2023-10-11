"use client";

import type { PropsWithChildren } from "react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";

import { TooltipProvider } from "@acme/ui/components/tooltip";

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: "light" | "dark" | "system";
  };

  return <Toaster theme={theme} closeButton richColors />;
};

interface Props {
  session?: Session | null;
}

export function Providers({ session, children }: PropsWithChildren<Props>) {
  return (
    <>
      <ToasterProvider />
      <TooltipProvider>
        <SessionProvider session={session}>{children}</SessionProvider>
      </TooltipProvider>
    </>
  );
}
