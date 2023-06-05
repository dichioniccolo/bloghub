import { type MediaType } from "@acme/db";

export function determineMediaType(file: File): MediaType | null {
  if (/image/i.test(file.type)) {
    return "IMAGE";
  }
  if (/video/i.test(file.type)) {
    return "VIDEO";
  }
  if (/audio/i.test(file.type)) {
    return "AUDIO";
  }
  return null;
}
