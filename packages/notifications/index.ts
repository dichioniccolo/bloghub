import { z } from "zod";

import { type NotificationType } from "@acme/db";

import { qstashClient } from "./lib/client";

export type AppNotification =
  | {
      type: typeof NotificationType.PROJECT_INVITATION;
      data: ProjectInvitationNotificationData;
    }
  | {
      type: typeof NotificationType.REMOVED_FROM_PROJECT;
      data: RemovedFromProjectNotificationData;
    };

export const ProjectInvitationNotificationSchema = z.object({
  projectId: z.string().nonempty(),
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
      type,
      data,
    },
  });
}
