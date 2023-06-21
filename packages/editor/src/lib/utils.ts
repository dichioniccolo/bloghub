import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { type MediaEnumType } from "@acme/db";

export function determineMediaType(file: File): MediaEnumType | null {
  if (/image/i.test(file.type)) {
    return 1;
  }

  if (/video/i.test(file.type)) {
    return 2;
  }

  if (/audio/i.test(file.type)) {
    return 3;
  }

  return null;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
