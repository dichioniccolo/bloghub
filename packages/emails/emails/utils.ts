import {
  db,
  emailNotificationSettings,
  eq,
  inArray,
  users,
  type EmailNotificationSettingType,
} from "@bloghub/db";

export async function fetchEmailNotificationSettings(
  type: EmailNotificationSettingType,
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
  emails: string[],
  emailSettingsMap: ReturnType<typeof createEmailSettingsMap>,
) {
  return emails.filter((email) => {
    return (
      !emailSettingsMap.has(email) || emailSettingsMap.get(email) !== false
    );
  });
}
