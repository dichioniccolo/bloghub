import type { PropsWithChildren } from "react";

import "~/styles/globals.css";

import { cn } from "@acme/ui";
import { fontMapper } from "@acme/ui/styles/fonts";

import { Providers } from "./providers";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head />
      <body className={cn(fontMapper["font-sans"], "font-sans")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
