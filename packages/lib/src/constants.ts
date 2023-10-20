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

export const Crons = {
  EVERY_MINUTE: "* * * * *",
  EVERY_HOUR: "0 * * * *",
  EVERY_DAY: "0 0 * * *",
  EVERY_DAY_AT_1AM: "0 1 * * *",
  EVERY_DAY_AT_2AM: "0 2 * * *",
  EVERY_DAY_AT_3AM: "0 3 * * *",
  EVERY_DAY_AT_4AM: "0 4 * * *",
  EVERY_WEEK: "0 0 * * 0",
  EVERY_MONTH: "0 0 1 * *",
  EVERY_YEAR: "0 0 1 1 *",
  EVERY_5_MINUTES: "*/5 * * * *",
  EVERY_10_MINUTES: "*/10 * * * *",
  EVERY_15_MINUTES: "*/15 * * * *",
  EVERY_30_MINUTES: "*/30 * * * *",
  EVERY_2_HOURS: "0 */2 * * *",
  EVERY_6_HOURS: "0 */6 * * *",
  EVERY_12_HOURS: "0 */12 * * *",
};
