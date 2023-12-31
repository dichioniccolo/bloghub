import { z } from "zod";

import type { NotificationStatus } from "@acme/db";

export interface ProjectInvitationNotification {
  type: "PROJECT_INVITATION";
  body: ProjectInvitationNotificationData;
}

export interface RemovedFromProjectNotification {
  type: "REMOVED_FROM_PROJECT";
  body: RemovedFromProjectNotificationData;
}

export interface InvitationAcceptedNotification {
  type: "INVITATION_ACCEPTED";
  body: InvitationAcceptedNotificationData;
}

export type AppNotification = {
  id: string;
  status: NotificationStatus;
  createdAt: Date;
} & (
  | ProjectInvitationNotification
  | RemovedFromProjectNotification
  | InvitationAcceptedNotification
);

export function isProjectInvitationNotification(
  notification: AppNotification,
): notification is Extract<AppNotification, { type: "PROJECT_INVITATION" }> {
  return notification.type === "PROJECT_INVITATION";
}

export function isRemovedFromProjectNotification(
  notification: AppNotification,
): notification is Extract<AppNotification, { type: "REMOVED_FROM_PROJECT" }> {
  return notification.type === "REMOVED_FROM_PROJECT";
}

export function isInvitationAcceptedNotification(
  notification: AppNotification,
): notification is Extract<AppNotification, { type: "INVITATION_ACCEPTED" }> {
  return notification.type === "INVITATION_ACCEPTED";
}

export const ProjectInvitationNotificationSchema = z.object({
  projectId: z.string().min(1),
  projectName: z.string().min(1),
  userEmail: z.string().email(),
});

export type ProjectInvitationNotificationData = z.input<
  typeof ProjectInvitationNotificationSchema
>;

export const RemovedFromProjectNotificationSchema = z.object({
  projectName: z.string().min(1),
  userEmail: z.string().email(),
});

export type RemovedFromProjectNotificationData = z.input<
  typeof RemovedFromProjectNotificationSchema
>;

export const InvitationAcceptedNotificationSchema = z.object({
  projectId: z.string().min(1),
  projectName: z.string().min(1),
  userEmail: z.string().email(),
});

export type InvitationAcceptedNotificationData = z.input<
  typeof InvitationAcceptedNotificationSchema
>;
