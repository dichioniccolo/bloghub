"use client";

import { type PropsWithChildren } from "react";
import { type Session } from "@bloghub/auth";
import { TooltipProvider } from "@bloghub/ui/components/tooltip";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

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
