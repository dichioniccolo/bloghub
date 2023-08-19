import { z } from "zod";

import type { Notification, NotificationStatusType } from "@acme/db";

export type ProjectInvitationNotification = {
  type: typeof Notification.ProjectInvitation;
  data: ProjectInvitationNotificationData;
};

export type RemovedFromProjectNotification = {
  type: typeof Notification.RemovedFromProject;
  data: RemovedFromProjectNotificationData;
};

export type InvitationAcceptedNotification = {
  type: typeof Notification.InvitationAccepted;
  data: InvitationAcceptedNotificationData;
};

export type AppNotification = {
  id: string;
  status: NotificationStatusType;
  createdAt: Date;
} & (
  | ProjectInvitationNotification
  | RemovedFromProjectNotification
  | InvitationAcceptedNotification
);

export function isProjectInvitationNotification(
  notification: AppNotification,
): notification is Extract<
  AppNotification,
  { type: typeof Notification.ProjectInvitation }
> {
  return notification.type === 1;
}

export function isRemovedFromProjectNotification(
  notification: AppNotification,
): notification is Extract<
  AppNotification,
  { type: typeof Notification.RemovedFromProject }
> {
  return notification.type === 2;
}

export function isInvitationAcceptedNotification(
  notification: AppNotification,
): notification is Extract<
  AppNotification,
  { type: typeof Notification.InvitationAccepted }
> {
  return notification.type === 3;
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

export const InvitationAcceptedNotificationSchema = z.object({
  projectId: z.string().nonempty(),
  projectName: z.string().nonempty(),
  userEmail: z.string().email(),
});

export type InvitationAcceptedNotificationData = z.input<
  typeof InvitationAcceptedNotificationSchema
>;
