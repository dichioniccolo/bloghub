"use client";

import { type PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { type Session } from "@acme/auth";
import { TooltipProvider } from "@acme/ui/tooltip";

type Props = {
  session?: Session | null;
};

export function Providers({ session, children }: PropsWithChildren<Props>) {
  return (
    <SessionProvider session={session}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster closeButton />
    </SessionProvider>
  );
}
