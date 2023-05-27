import { type PropsWithChildren } from "react";
import { type Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@acme/ui";

import "@acme/ui/styles/globals.css";
import { env } from "~/env.mjs";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: env.NEXT_PUBLIC_APP_NAME,
    template: `%s | ${env.NEXT_PUBLIC_APP_NAME}`,
  },
  keywords: [
    "Next.js",
    "React",
    "Prisma",
    "Tailwind CSS",
    "Server Components",
    "Server Actions",
    "Edge Runtime",
    "Radix UI",
  ],
  authors: [
    {
      name: "Niccolò Di Chio",
      url: "https://www.niccolodichio.it",
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
    // url: absoluteUrl(),
    title: env.NEXT_PUBLIC_APP_NAME,
    // description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    siteName: env.NEXT_PUBLIC_APP_NAME,
    // images: [
    //   {
    //     url: subdomainUrl("api", "og"),
    //     width: 1200,
    //     height: 630,
    //     alt: env.NEXT_PUBLIC_APP_NAME,
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: env.NEXT_PUBLIC_APP_NAME,
    // description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    // images: [subdomainUrl("api", "og")],
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
} satisfies Metadata;

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-primary font-sans text-slate-900 antialiased",
        fontInter.variable,
      )}
    >
      <head />
      <body>{children}</body>
    </html>
  );
}
