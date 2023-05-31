import "@acme/ui/styles/globals.css";

import { type PropsWithChildren } from "react";
import { Inter, Roboto_Mono } from "next/font/google";

import { cn } from "~/lib/utils";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

// export const metadata = {
//   // TODO: load project name from domain
//   title: {
//     default: env.NEXT_PUBLIC_APP_NAME,
//     template: `%s | ${env.NEXT_PUBLIC_APP_NAME}`,
//   },
//   keywords: [
//     "Next.js",
//     "React",
//     "Prisma",
//     "Tailwind CSS",
//     "Server Components",
//     "Server Actions",
//     "Edge Runtime",
//     "Radix UI",
//   ],
//   authors: [
//     {
//       name: "Niccolò Di Chio",
//       url: "https://www.niccolodichio.it",
//     },
//   ],
//   creator: "Niccolò Di Chio",
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "white" },
//     { media: "(prefers-color-scheme: dark)", color: "black" },
//   ],
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     // url: absoluteUrl(),
//     title: env.NEXT_PUBLIC_APP_NAME,
//     // description: env.NEXT_PUBLIC_APP_DESCRIPTION,
//     siteName: env.NEXT_PUBLIC_APP_NAME,
//     // images: [
//     //   {
//     //     url: subdomainUrl("api", "og"),
//     //     width: 1200,
//     //     height: 630,
//     //     alt: env.NEXT_PUBLIC_APP_NAME,
//     //   },
//     // ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: env.NEXT_PUBLIC_APP_NAME,
//     // description: env.NEXT_PUBLIC_APP_DESCRIPTION,
//     // images: [subdomainUrl("api", "og")],
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
// } satisfies Metadata;

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={cn(inter.variable, roboto_mono.variable)}>
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
