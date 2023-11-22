"use server";

import { db, EmailNotificationSettingType } from "@acme/db";

import { getCurrentUser } from "./get-user";

export async function getNotificationsSettings() {
  const user = await getCurrentUser();

  const settings = await db.emailNotificationSetting.findMany({
    where: {
      userId: user.id,
    },
    select: {
      type: true,
      value: true,
    },
  });

  return {
    communication:
      settings.find(
        (s) => s.type === EmailNotificationSettingType.COMMUNICATION,
      )?.value ?? true,
    marketing:
      settings.find((s) => s.type === EmailNotificationSettingType.MARKETING)
        ?.value ?? true,
    social:
      settings.find((s) => s.type === EmailNotificationSettingType.SOCIAL)
        ?.value ?? true,
    security: true as const,
  };
}
