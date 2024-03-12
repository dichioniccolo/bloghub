import type { PropsWithChildren } from "react";

import "~/styles/globals.css";
import "~/styles/tiptap.css";

import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { AxiomWebVitals } from "next-axiom";

import { AI } from "@acme/editor/ai";
import { subdomainUrl } from "@acme/lib/url";
import { cn } from "@acme/ui";
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
      "DrizzleORM",
      "Tailwind CSS",
      "Server Components",
      "Server Actions",
      "Edge Runtime",
      "Radix UI",
      "ui.shadcn.com",
    ],
    authors: [
      {
        name: "Niccolò Di Chio",
        url: "https://github.com/dichioniccolo",
      },
    ],
    creator: "Niccolò Di Chio",
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html className={cn(fontMapper["font-sans"], "h-full font-sans")} lang="en">
      <head />
      <body className="h-full">
        <AxiomWebVitals />
        <Providers>
          <AI>{children}</AI>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
