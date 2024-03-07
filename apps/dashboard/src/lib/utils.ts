import { get } from "@vercel/edge-config";

export const isEmailBlacklisted = async (email: string) => {
  const blacklistedEmails = (await get("emailBlacklist"))!;

  if (!blacklistedEmails) {
    return false;
  }

  if (Array.isArray(blacklistedEmails)) {
    return blacklistedEmails.includes(email);
  }

  return false;
};
