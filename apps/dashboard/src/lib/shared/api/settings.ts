"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";
import { EmailNotificationSettingType, prisma } from "@acme/db";

export async function getNotificationsSettings() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be authenticated");
  }

  const { user } = session;

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
  };
}
