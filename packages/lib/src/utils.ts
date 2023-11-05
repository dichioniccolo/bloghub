import type { NextRequest } from "next/server";
import { format } from "date-fns";

import type { MediaType } from "@acme/db";

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

/**
 *
 * @param range the number of indicies to generate from
 * @param count the number of indicies to generate
 */
export function generateRandomIndices(range: number, count: number): number[] {
  const indicies = new Set<number>();

  if (range < count) {
    count = range;
  }

  while (indicies.size < count) {
    const randomIndex = Math.floor(Math.random() * range);

    indicies.add(randomIndex);
  }

  return Array.from(indicies);
}

export function determineMediaType(file: File): MediaType {
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
