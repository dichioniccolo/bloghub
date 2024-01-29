"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: PropsWithChildren) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
