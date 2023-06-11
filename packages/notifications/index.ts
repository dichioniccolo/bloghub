import { z } from "zod";

import { type notificationStatus, type notificationTypeEnum } from "@acme/db";

export type ProjectInvitationNotification = {
  type: (typeof notificationTypeEnum.enumValues)[0];
  data: ProjectInvitationNotificationData;
};

export type RemovedFromProjectNotification = {
  type: (typeof notificationTypeEnum.enumValues)[1];
  data: RemovedFromProjectNotificationData;
};

export type AppNotification = {
  id: string;
  status: (typeof notificationStatus.enumValues)[number];
  createdAt: Date;
} & (ProjectInvitationNotification | RemovedFromProjectNotification);

export function isProjectInvitationNotification(
  notification: AppNotification,
): notification is Extract<
  AppNotification,
  { type: (typeof notificationTypeEnum.enumValues)[0] }
> {
  return notification.type === "project_invitation";
}

export function isRemovedFromProjectNotification(
  notification: AppNotification,
): notification is Extract<
  AppNotification,
  { type: (typeof notificationTypeEnum.enumValues)[1] }
> {
  return notification.type === "removed_from_project";
}

export const ProjectInvitationNotificationSchema = z.object({
  projectId: z.string().nonempty(),
  projectName: z.string().nonempty(),
  userEmail: z.string().email(),
});

export type ProjectInvitationNotificationData = z.input<
  typeof ProjectInvitationNotificationSchema
>;

export const RemovedFromProjectNotificationSchema = z.object({
  projectName: z.string().nonempty(),
  userEmail: z.string().email(),
});

export type RemovedFromProjectNotificationData = z.input<
  typeof RemovedFromProjectNotificationSchema
>;
