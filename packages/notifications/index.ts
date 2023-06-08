import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

import { type notificationTypeEnum } from "@acme/db";

import { qstashClient } from "./lib/client";

export type ProjectInvitationNotification = {
  type: (typeof notificationTypeEnum.enumValues)[0];
  data: ProjectInvitationNotificationData;
};

export type RemovedFromProjectNotification = {
  type: (typeof notificationTypeEnum.enumValues)[1];
  data: RemovedFromProjectNotificationData;
};

export type AppNotification = { id: string } & (
  | ProjectInvitationNotification
  | RemovedFromProjectNotification
);

export function isProjectInvitationNotification(
  notification: Omit<AppNotification, "id">,
): notification is ProjectInvitationNotification {
  return notification.type === "project_invitation";
}

export function isRemovedFromProjectNotification(
  notification: Omit<AppNotification, "id">,
): notification is RemovedFromProjectNotification {
  return notification.type === "removed_from_project";
}

export const ProjectInvitationNotificationSchema = z.object({
  projectId: z.string().nonempty(),
  projectName: z.string().nonempty(),
  userEmail: z.string().email(),
});

export type ProjectInvitationNotificationData = z.infer<
  typeof ProjectInvitationNotificationSchema
>;

export const RemovedFromProjectNotificationSchema = z.object({
  projectName: z.string().nonempty(),
  userEmail: z.string().email(),
});

export type RemovedFromProjectNotificationData = z.infer<
  typeof RemovedFromProjectNotificationSchema
>;

export async function publishNotification<T extends AppNotification["type"]>(
  type: T,
  data?: Extract<AppNotification, { type: T }>["data"],
) {
  await qstashClient.publishJSON({
    topic: "notifications",
    body: {
      id: createId(),
      type,
      data,
    },
  });
}
