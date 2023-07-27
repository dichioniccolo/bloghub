"use client";

import type { PropsWithChildren } from "react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

type Props = {
  session?: Session | null;
};

export function AuthProviders({ session, children }: PropsWithChildren<Props>) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
