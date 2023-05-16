"use client";

import { type PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

import { type Session } from "@acme/auth";
import { Toaster } from "@acme/ui";

type Props = PropsWithChildren<{
  session?: Session | null;
}>;

export function Providers({ session, children }: Props) {
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster />
    </SessionProvider>
  );
}
