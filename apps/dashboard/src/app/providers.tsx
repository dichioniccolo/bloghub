"use client";

import { type PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

import { type Session } from "@acme/auth";
import { Toaster, TooltipProvider } from "@acme/ui";

type Props = {
  session?: Session | null;
};

export function Providers({ session, children }: PropsWithChildren<Props>) {
  return (
    <SessionProvider session={session}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </SessionProvider>
  );
}
