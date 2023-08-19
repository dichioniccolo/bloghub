"use server";

import {
    db,
    EmailNotificationSetting,
    emailNotificationSettings,
    eq,
} from "@acme/db";

import { $getUser } from "./get-user";

export async function getNotificationsSettings() {
  const user = await $getUser();

  const settings = await db
    .select({
      type: emailNotificationSettings.type,
      value: emailNotificationSettings.value,
    })
    .from(emailNotificationSettings)
    .where(eq(emailNotificationSettings.userId, user.id));

  return {
    communication_emails:
      settings.find((s) => s.type === EmailNotificationSetting.Communication)
        ?.value ?? true,
    marketing_emails:
      settings.find((s) => s.type === EmailNotificationSetting.Marketing)
        ?.value ?? true,
    social_emails:
      settings.find((s) => s.type === EmailNotificationSetting.Social)?.value ??
      true,
    security_emails: true as const,
  };
}
