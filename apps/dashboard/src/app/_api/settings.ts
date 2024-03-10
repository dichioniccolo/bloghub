"use server";

import { prisma } from "@acme/db";

import { getCurrentUser } from "./get-user";

export async function getNotificationsSettings() {
  const user = await getCurrentUser();

  const settings = await prisma.emailNotificationSettings.findMany({
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
      settings.find((s) => s.type === "COMMUNICATION")?.value ?? true,
    marketing: settings.find((s) => s.type === "MARKETING")?.value ?? true,
    social: settings.find((s) => s.type === "SOCIAL")?.value ?? true,
    security: true as const,
  };
}
