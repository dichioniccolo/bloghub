import { type NextRequest } from "next/server";
import { format } from "date-fns";

export function parseRequest(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const paths = path.split("/");

  const keys = decodeURIComponent(paths.join("/"));

  return { path, keys };
}

export function getSubDomain(name?: string, apexName?: string) {
  if (!name || !apexName || name === apexName) {
    return null;
  }

  return name.slice(0, name.length - apexName.length - 1);
}

export function getDefaultAvatarImage(text: string) {
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
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
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
