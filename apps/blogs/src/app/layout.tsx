import type { PropsWithChildren } from "react";

import "~/styles/globals.css";
import "~/styles/tiptap.css";

import { AxiomWebVitals } from "next-axiom";

import { cn } from "@acme/ui";
import { fontMapper } from "@acme/ui/styles/fonts";

import { Providers } from "./providers";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          fontMapper["font-sans"],
          fontMapper["font-mono"],
          "font-sans",
        )}
      >
        <AxiomWebVitals />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
