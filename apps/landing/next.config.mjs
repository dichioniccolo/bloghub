// Importing env files here to validate on build
import "@acme/db/env";
import "@acme/emails/env";
import "@acme/pusher/env";
import "@acme/stripe/env";
import "@acme/vercel/env";
import "./src/env.mjs";

import { env } from "./src/env.mjs";

// const ContentSecurityPolicy = `
//   default-src 'self';
//   script-src https://vercel.live/ https://vercel.com unsafe-inline unsafe-eval;
//   style-src 'self' 'unsafe-inline';
//   img-src * blob: data:;
//   base-uri 'self';
//   media-src https://cdn.bloghub.it;
//   connect-src *;
//   font-src 'self';
//   frame-src youtube.com www.youtube.com https://vercel.live/ https://vercel.com;
//   worker-src 'self' blob:;
//   child-src 'self' blob:;
// `;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  // {
  //   key: "Content-Security-Policy",
  //   value: ContentSecurityPolicy.replace(/\n/g, ""),
  // },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: "Referrer-Policy",
    value: "same-origin",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
  {
    key: "Permissions-Policy",
    value: "fullscreen=()",
  },
];

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.bloghub.it",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "bloghub.it",
        port: "",
        pathname: "**",
      },
    ],
    domains: [
      "avatar.vercel.sh",
      "abs.twimg.com",
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "www.google.com",
      "flag.vercel.app",
    ],
  },
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@acme/db",
    "@acme/emails",
    "@acme/files",
    "@acme/inngest",
    "@acme/lib",
    "@acme/notifications",
    "@acme/pusher",
    "@acme/stripe",
    "@acme/vercel",
    "@acme/ui",
  ],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverActions: true,
    useDeploymentId: true,
    useDeploymentIdServerActions: true,
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
  compiler: {
    removeConsole:
      env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : undefined,
  },
  productionBrowserSourceMaps: true,
  // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
};

export default config;
