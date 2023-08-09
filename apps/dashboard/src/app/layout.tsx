import type { PropsWithChildren } from "react";

import "~/styles/globals.css";
import "~/styles/tiptap.css";

import { Analytics } from "@vercel/analytics/react";

import { fontMapper } from "~/styles/fonts";
import { cn } from "~/lib/cn";
import { Providers } from "./providers";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(fontMapper["font-sans"], "font-sans")}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
