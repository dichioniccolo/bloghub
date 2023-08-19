"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

type Props = {
  children: ReactNode;
};

export function CustomDomainProviders({ children }: Props) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
