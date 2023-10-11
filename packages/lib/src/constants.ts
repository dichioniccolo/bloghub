import { env } from "./env.mjs";

export const TEST_HOSTNAME = "test.niccolodichio.it";

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

export const GOOGLE_FAVICON_URL = `https://www.google.com/s2/favicons?sz=64&domain=`;

export const ROOM_DIVIDER = "-";
