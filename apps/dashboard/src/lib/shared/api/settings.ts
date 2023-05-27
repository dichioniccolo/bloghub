"use server";

import { EmailNotificationSettingType, prisma } from "@acme/db";

import { $getUser } from "../get-user";

export async function getNotificationsSettings() {
  const user = await $getUser();

  const settings = await prisma.emailNotificationSetting.findMany({
    where: {
      userId: user.id,
    },
  });

  return {
    communication_emails:
      settings.find(
        (s) => s.type === EmailNotificationSettingType.COMMUNICATION,
      )?.value ?? true,
    marketing_emails:
      settings.find((s) => s.type === EmailNotificationSettingType.MARKETING)
        ?.value ?? true,
    social_emails:
      settings.find((s) => s.type === EmailNotificationSettingType.SOCIAL)
        ?.value ?? true,
    security_emails: true as const,
    // settings.find((s) => s.type === EmailNotificationSettingType.SECURITY)
    //   ?.value ?? true,
  };
}
