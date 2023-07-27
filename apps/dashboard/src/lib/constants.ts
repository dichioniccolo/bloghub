import { env } from "~/env.mjs";

export const TEST_HOSTNAME = "test.niccolodichio.it";

export const HOME_HOSTNAMES = new Set([
  env.NEXT_PUBLIC_APP_DOMAIN,
  "localhost",
  "localhost:3000",
]);

export const APP_HOSTNAMES = new Set([
  `app.${env.NEXT_PUBLIC_APP_DOMAIN}`,
  "app.localhost:3000",
  "app.localhost",
]);

export const API_HOSTNAMES = new Set([
  `api.${env.NEXT_PUBLIC_APP_DOMAIN}`,
  "api.localhost:3000",
  "api.localhost",
]);
