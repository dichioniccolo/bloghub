// Importing env files here to validate on build
import "@acme/auth/env.mjs";
import "@acme/db/env.mjs";
import "@acme/mailing/env.mjs";
import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@acme/mailing", "@acme/auth", "@acme/db", "@acme/ui"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverActions: true,
    // runtime: "edge",
    serverComponentsExternalPackages: [
      "@acme/mailing",
      "@acme/auth",
      "@acme/db",
      "@acme/ui",
    ],
  },
};

export default config;
