import type { NextRequest } from "next/server";
import {
  format,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
} from "date-fns";
import baseSlugify from "slugify";

import { ROOM_DIVIDER, TEST_HOSTNAME } from "./constants";
import { env } from "./env.mjs";

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch (e) {
    return null;
  }
}

export const truncate = (str: string, num: number) => {
  if (!str) return "";
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export function getSubDomain(name?: string, apexName?: string) {
  if (!name || !apexName || name === apexName) {
    return null;
  }

  return name.slice(0, name.length - apexName.length - 1);
}

export function getDefaultAvatarImage(text?: string) {
  if (!text) {
    return "https://avatar.vercel.sh/unknown?size=400";
  }

  return `https://avatar.vercel.sh/${text}?size=400`;
}

const lookup = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: "K" },
  { value: 1e6, symbol: "M" },
  { value: 1e9, symbol: "G" },
  { value: 1e12, symbol: "T" },
  { value: 1e15, symbol: "P" },
  { value: 1e18, symbol: "E" },
];

export function formatNumber(num: number, digits?: number): string {
  if (!num) {
    return "0";
  }

  if (num === Number.MAX_SAFE_INTEGER) {
    return "unlimited";
  }

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);

  return item
    ? (num / item.value).toFixed(digits ?? 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function getMonthByNumber(month: number, stringFormat = "MMMM") {
  const date = new Date().setMonth(month - 1);

  return format(date, stringFormat);
}

export function determineMediaType(
  file: File,
): "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" {
  if (/image/i.test(file.type)) {
    return "IMAGE";
  }

  if (/video/i.test(file.type)) {
    return "VIDEO";
  }

  if (/audio/i.test(file.type)) {
    return "AUDIO";
  }

  return "DOCUMENT";
}

export function getRoom(projectId: string, postId: string) {
  return projectId + ROOM_DIVIDER + postId;
}

export function parseRequest(req: NextRequest) {
  let domain = req.headers.get("host")!;
  domain = domain.replace("www.", ""); // remove www. from domain

  if (domain.includes("test.localhost") && env.NODE_ENV === "development")
    domain = TEST_HOSTNAME;

  const path = req.nextUrl.pathname;

  // Here, we are using decodeURIComponent to handle foreign languages like Hebrew
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const key = decodeURIComponent(path.split("/")[1]);
  const fullKey = decodeURIComponent(path.slice(1));

  return { domain, path, key, fullKey };
}

export type AnalyticsInterval =
  | (typeof INTERVALS)[number]["value"]
  | (typeof PRO_INTERVALS)[number]["value"];

export type AnalyticsLocationsTab = "country" | "city";

export type AnalyticsDevicesTab = "device" | "browser" | "os";

export const INTERVALS = [
  {
    display: "Last hour",
    value: "1h" as const,
  },
  {
    display: "Last 24 hours",
    value: "24h" as const,
  },
  {
    display: "Last 7 days",
    value: "7d" as const,
  },
  {
    display: "Last 30 days",
    value: "30d" as const,
  },
  {
    display: "Last 3 months",
    value: "90d" as const,
  },
];

export const PRO_INTERVALS = [
  {
    display: "All Time",
    value: "all" as const,
  },
];

export const intervalsFilters: Record<AnalyticsInterval, { createdAt?: Date }> =
  {
    "1h": {
      createdAt: new Date(Date.now() - 3600000),
    },
    "24h": {
      createdAt: new Date(Date.now() - 86400000),
    },
    "7d": {
      createdAt: new Date(Date.now() - 604800000),
    },
    "30d": {
      createdAt: new Date(Date.now() - 2592000000),
    },
    "90d": {
      createdAt: new Date(Date.now() - 7776000000),
    },
    all: {},
  };

export const ANALYTICS_VALID_STATS_FILTERS = [
  {
    name: "Country",
    value: "country",
  },
  {
    name: "City",
    value: "city",
  },
  {
    name: "Device",
    value: "device",
  },
  {
    name: "Browser",
    value: "browser",
  },
  {
    name: "OS",
    value: "os",
  },
  {
    name: "Referrer",
    value: "referer",
  },
];

export function roundDateToInterval(date: Date, interval: AnalyticsInterval) {
  switch (interval) {
    case "1h":
      return startOfMinute(date);
    case "24h":
      return startOfHour(date);
    case "7d":
    case "30d":
      return startOfDay(date);
    default:
      return startOfMonth(date);
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(value: string): string {
  return baseSlugify(value, {
    lower: true,
    strict: true,
  });
}

export function generatePostSlug(title: string, id: string): string {
  return `${slugify(title)}-${id}`;
}

export function getPostIdFromSlug(slug: string): string | null {
  const parts = slug.split("-");
  const id = parts[parts.length - 1];
  return id ?? null;
}
