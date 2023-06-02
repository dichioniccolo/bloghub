import { type NextRequest } from "next/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function parseRequest(req: NextRequest) {
  const domain = req.headers.get("host") ?? "";
  const path = req.nextUrl.pathname;

  const paths = path.split("/");

  const keys = decodeURIComponent(paths.join("/"));

  return { domain, path, keys };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
