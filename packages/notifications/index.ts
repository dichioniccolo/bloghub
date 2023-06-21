import { z } from "zod";

import { Notification, type NotificationStatusType } from "@acme/db";

export type ProjectInvitationNotification = {
  type: typeof Notification.ProjectInvitation;
  data: ProjectInvitationNotificationData;
};

export type RemovedFromProjectNotification = {
  type: typeof Notification.RemovedFromProject;
  data: RemovedFromProjectNotificationData;
};

export type AppNotification = {
  id: string;
  status: NotificationStatusType;
  createdAt: Date;
} & (ProjectInvitationNotification | RemovedFromProjectNotification);

export function isProjectInvitationNotification(
  notification: AppNotification,
): notification is Extract<
  AppNotification,
  { type: typeof Notification.ProjectInvitation }
> {
  return notification.type === Notification.ProjectInvitation;
}

export function isRemovedFromProjectNotification(
  notification: AppNotification,
): notification is Extract<
  AppNotification,
  { type: typeof Notification.RemovedFromProject }
> {
  return notification.type === Notification.RemovedFromProject;
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
