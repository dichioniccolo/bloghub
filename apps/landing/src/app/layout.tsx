import type { ReactNode } from "react";

import "~/styles/globals.css";

import { cn } from "@acme/ui";
import { fontMapper } from "@acme/ui/styles/fonts";

interface Props {
  // modal: ReactNode;
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          fontMapper["font-sans"],
          "flex min-h-screen flex-col justify-between font-sans",
        )}
      >
        {/* <MarketingProviders modal={modal}> */}
        {/* <Nav /> */}
        {children}
        {/* <Footer /> */}
        {/* </MarketingProviders> */}
      </body>
    </html>
  );
}
