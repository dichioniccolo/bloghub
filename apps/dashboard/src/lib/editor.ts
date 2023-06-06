import { type mediaTypeEnum } from "@acme/db";

export function determineMediaType(
  file: File,
): (typeof mediaTypeEnum.enumValues)[number] | null {
  if (/image/i.test(file.type)) {
    return "image";
  }
  if (/video/i.test(file.type)) {
    return "video";
  }
  if (/audio/i.test(file.type)) {
    return "audio";
  }
  return null;
}
