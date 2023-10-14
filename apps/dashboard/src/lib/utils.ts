import { get } from "@vercel/edge-config";

export const isEmailBlacklisted = async (email: string) => {
  const blacklistedEmails: string[] = (await get("emailBlacklist"))!;

  if (!blacklistedEmails) {
    return false;
  }

  return blacklistedEmails.includes(email);
};
