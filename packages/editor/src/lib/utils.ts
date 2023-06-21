import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { MediaEnum, type MediaEnumType } from "@acme/db";

export function determineMediaType(file: File): MediaEnumType | null {
  if (/image/i.test(file.type)) {
    return MediaEnum.Image;
  }

  if (/video/i.test(file.type)) {
    return MediaEnum.Video;
  }

  if (/audio/i.test(file.type)) {
    return MediaEnum.Audio;
  }

  return null;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
