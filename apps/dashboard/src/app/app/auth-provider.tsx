"use client";

import { PropsWithChildren } from "react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

type Props = {
  session?: Session | null;
};

export function AuthProviders({ session, children }: PropsWithChildren<Props>) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
