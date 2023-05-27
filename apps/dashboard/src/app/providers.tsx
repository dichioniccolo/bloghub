"use client";

import { type PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

import { type Session } from "@acme/auth";
import { Toaster, TooltipProvider } from "@acme/ui";

import { ThemeProvider } from "./theme-provider";

type Props = {
  session?: Session | null;
};

export function Providers({ session, children }: PropsWithChildren<Props>) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}
