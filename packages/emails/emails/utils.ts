import type Mail from "nodemailer/lib/mailer";

import { prisma, type EmailNotificationSettingType } from "@acme/db";

export async function fetchEmailNotificationSettings(
  type: EmailNotificationSettingType,
  emailAddresses: string[],
) {
  const usersSettings = await prisma.emailNotificationSetting.findMany({
    where: {
      type,
      user: {
        email: { in: emailAddresses },
      },
    },
    select: {
      user: { select: { email: true } },
      value: true,
    },
  });
  return usersSettings;
}

export function createEmailSettingsMap(
  usersSettings: Awaited<ReturnType<typeof fetchEmailNotificationSettings>>,
) {
  const emailSettingsMap = new Map();
  for (const setting of usersSettings) {
    emailSettingsMap.set(setting.user.email, setting.value);
  }
  return emailSettingsMap;
}

export function filterEmailsBySettings(
  emails: Mail.Address[],
  emailSettingsMap: ReturnType<typeof createEmailSettingsMap>,
) {
  return emails.filter((email) => {
    const userSetting = emailSettingsMap.get(email.address);
    return !userSetting || userSetting !== false;
  });
}
