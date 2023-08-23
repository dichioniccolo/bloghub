import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";

import { env } from "~/env.mjs";
import { authOptions } from "~/lib/auth";
import { AuthProviders } from "./providers";

export function generateMetadata() {
  const appUrl =
    env.NODE_ENV === "development"
      ? `http://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
      : `https://app.${env.NEXT_PUBLIC_APP_DOMAIN}`;

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

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

  return <AuthProviders session={session}>{children}</AuthProviders>;
}
