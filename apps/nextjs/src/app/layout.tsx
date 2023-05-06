import { type PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { cn } from "~/lib/utils";
import "~/styles/globals.css";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head />
        <body
          className={cn(
            "bg-white font-sans text-slate-900 antialiased",
            fontInter.variable,
          )}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
