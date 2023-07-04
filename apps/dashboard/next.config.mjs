// Importing env files here to validate on build
import "@bloghub/db/env.mjs";
import "@bloghub/emails/env.mjs";
import "./src/env.mjs";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  child-src 'none';
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  base-uri 'self';
  media-src https://cdn.bloghub.it;
  connect-src *;
  font-src 'self';
  frame-src youtube.com www.youtube.com;
`;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
  },
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
    domains: [
      "avatar.vercel.sh",
      "cdn.bloghub.it",
      "abs.twimg.com",
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "www.google.com",
      "flag.vercel.app",
    ],
  },
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@bloghub/db", "@bloghub/emails"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverActions: true,
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/{{lowerCase kebabCase member}}",
      skipDefaultConversion: true,
      preventFullImport: true,
    },
  },
  compiler: {
    removeConsole: {
      exclude: ["error", "warn"],
    },
  },
  // only if deploying with docker
  // output: "standalone",
  // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
};

export default config;
