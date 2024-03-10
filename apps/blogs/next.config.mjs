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
    unoptimized: true,
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
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "abs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "flag.vercel.app",
      },
      {
        protocol: "https",
        hostname: "admmbojoaidpxiai.public.blob.vercel-storage.com",
      },
    ],
  },
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@acme/db",
    "@acme/editor",
    "@acme/emails",
    "@acme/files",
    "@acme/inngest",
    "@acme/lib",
    "@acme/notifications",
    "@acme/pusher",
    "@acme/stripe",
    "@acme/ui",
    "@acme/vercel",
  ],
  eslint: { ignoreDuringBuilds: true },
  // typescript: { ignoreBuildErrors: true },
  experimental: {
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
  webpack: function (config, options) {
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  },
};

export default config;
