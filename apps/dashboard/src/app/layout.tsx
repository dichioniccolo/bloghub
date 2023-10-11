import type { PropsWithChildren } from "react";

import "~/styles/globals.css";
import "~/styles/tiptap.css";

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Construction } from "lucide-react";

import { subdomainUrl } from "@acme/lib/url";
import { cn } from "@acme/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@acme/ui/components/popover";
import { fontMapper } from "@acme/ui/styles/fonts";

import { env } from "~/env.mjs";
import { Providers } from "./providers";

export function generateMetadata() {
  const appUrl = subdomainUrl("app");

  const ogImage = new URL("/api/og", appUrl);
  ogImage.searchParams.set("title", env.NEXT_PUBLIC_APP_NAME);
  ogImage.searchParams.set("description", env.NEXT_PUBLIC_APP_DESCRIPTION);
  ogImage.searchParams.set("theme", "dark");

  return {
    title: {
      default: env.NEXT_PUBLIC_APP_NAME,
      template: `%s | ${env.NEXT_PUBLIC_APP_NAME}`,
    },
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    keywords: [
      "Next.js",
      "React",
      "Drizzle ORM",
      "Tailwind CSS",
      "Server Components",
      "Server Actions",
      "Edge Runtime",
      "Radix UI",
      "shadcn/ui",
    ],
    authors: [
      {
        name: "Niccolò Di Chio",
        url: "https://github.com/dichioniccolo",
      },
    ],
    creator: "Niccolò Di Chio",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: appUrl,
      title: env.NEXT_PUBLIC_APP_NAME,
      description: env.NEXT_PUBLIC_APP_DESCRIPTION,
      siteName: env.NEXT_PUBLIC_APP_NAME,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: env.NEXT_PUBLIC_APP_NAME,
      description: env.NEXT_PUBLIC_APP_DESCRIPTION,
      images: [ogImage],
      creator: "@niccolodichio",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    metadataBase: new URL(appUrl),
  } satisfies Metadata;
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head />
      <body className={cn(fontMapper["font-sans"], "font-sans")}>
        <Providers>{children}</Providers>
        <Analytics />
        <Popover>
          <PopoverTrigger className="fixed bottom-4 right-4 z-50 rounded-full border bg-background p-4">
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
