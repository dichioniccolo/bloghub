import { type NextRequest } from "next/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { ccTLDs } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseRequest(req: NextRequest) {
  const domain = req.headers.get("host") ?? "";
  const path = req.nextUrl.pathname;

  const paths = path.split("/");

  const keys = decodeURIComponent(paths.join("/"));

  return { domain, path, keys };
}

export function generateDomainFromName(name: string) {
  const normalizedName = name
    .trim()
    .toLowerCase()
    .replace(/[\W_]+/g, "");

  if (normalizedName.length < 3) {
    return "";
  }

  if (ccTLDs.has(normalizedName.slice(-2))) {
    return `${normalizedName.slice(0, -2)}.${normalizedName.slice(-2)}`;
  }

  // remove vowels
  const devowel = normalizedName.replace(/[aeiou]/g, "");
  if (devowel.length >= 3 && ccTLDs.has(devowel.slice(-2))) {
    return `${devowel.slice(0, -2)}.${devowel.slice(-2)}`;
  }

  const shortestString = [normalizedName, devowel].reduce((a, b) =>
    a.length < b.length ? a : b,
  );

  return `${shortestString}.to`;
}
