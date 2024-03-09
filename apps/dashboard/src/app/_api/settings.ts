"use server";

import { db, eq, schema } from "@acme/db";

import { getCurrentUser } from "./get-user";

export async function getNotificationsSettings() {
  const user = await getCurrentUser();

  const settings = await db.query.emailNotificationSettings.findMany({
    where: eq(schema.emailNotificationSettings.userId, user.id),
    columns: {
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
