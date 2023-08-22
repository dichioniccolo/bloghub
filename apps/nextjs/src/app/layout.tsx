import type { PropsWithChildren } from "react";

import "~/styles/globals.css";
import "~/styles/tiptap.css";

import { Analytics } from "@vercel/analytics/react";
import { Construction } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/cn";
import { fontMapper } from "~/styles/fonts";
import { Providers } from "./providers";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(fontMapper["font-sans"], "font-sans")}>
        <Providers>{children}</Providers>
        <Analytics />
        <Popover>
          <PopoverTrigger className="fixed bottom-4 right-4 z-50 rounded-full border p-4">
            <Construction />
          </PopoverTrigger>
          <PopoverContent className="max-w-md" align="end">
            <div className="flex items-center gap-x-2 text-base font-medium">
              <Construction />
              <span>Under construction</span>
            </div>
            <div className="mt-2 text-sm">
              This app is still under construction. You are free to use it, but
              expect bugs and missing features. If you find any bugs, please
              report them{" "}
              <a
                href="mailto:niccolo@bloghub.it"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
            </div>
          </PopoverContent>
        </Popover>
        {/* <div className="dark:border-border/80 fixed bottom-2 left-2 right-2 z-50 max-w-md divide-border/60 rounded-lg border border-border/60 bg-background p-2 shadow-sm ring-border dark:divide-border/80 dark:ring-border md:left-auto">
          <div className="flex items-center gap-x-2 text-base font-medium">
            Und
          </div>
        </div> */}
      </body>
    </html>
  );
}
