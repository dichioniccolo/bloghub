import { z } from "zod";

export type AppNotification =
  | {
      type: "project-invitation";
      data: ProjectInvitationNotificationData;
    }
  | {
      type: "removed-from-project";
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
