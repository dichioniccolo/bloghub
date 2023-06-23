import { type PropsWithChildren } from "react";
import { type Metadata } from "next";
import { getServerSession } from "next-auth";

import "@acme/editor/styles/tiptap.css";
import "@acme/ui/styles/globals.css";

import { authOptions } from "@acme/auth";

import { cal, inter } from "~/styles/fonts";
import { env } from "~/env.mjs";
import { cn } from "~/lib/utils";
import { Providers } from "./providers";

export function generateMetadata() {
  const ogImage = new URL("/api/og", env.NEXT_PUBLIC_APP_URL);
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
    creator: "dichioniccolo",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: env.NEXT_PUBLIC_APP_URL,
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
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  } satisfies Metadata;
}

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          cal.variable,
          inter.variable,
        )}
      >
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
