import type Mail from "nodemailer/lib/mailer";

import {
  db,
  emailNotificationSettings,
  eq,
  inArray,
  users,
  type emailNotificationSettingTypeEnum,
} from "@acme/db";

export async function fetchEmailNotificationSettings(
  type: (typeof emailNotificationSettingTypeEnum.enumValues)[number],
  emailAddresses: string[],
) {
  const usersSettings = await db
    .select({
      value: emailNotificationSettings.value,
      email: users.email,
    })
    .from(emailNotificationSettings)
    .innerJoin(users, inArray(users.email, emailAddresses))
    .where(eq(emailNotificationSettings.type, type));

  return usersSettings;
}

export function createEmailSettingsMap(
  usersSettings: Awaited<ReturnType<typeof fetchEmailNotificationSettings>>,
) {
  const emailSettingsMap = new Map<string, boolean>();
  for (const setting of usersSettings) {
    emailSettingsMap.set(setting.email, setting.value);
  }
  return emailSettingsMap;
}

export function filterEmailsBySettings(
  emails: Mail.Address[],
  emailSettingsMap: ReturnType<typeof createEmailSettingsMap>,
) {
  return emails.filter((email) => {
    return (
      !emailSettingsMap.has(email.address) ||
      emailSettingsMap.get(email.address) !== false
    );
  });
}
