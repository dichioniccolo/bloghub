"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

interface Props {
  children: ReactNode;
}

export function DashboardProviders({ children }: Props) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
