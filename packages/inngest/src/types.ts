export interface InvitationAcceptedNotificationData {
  projectId: string;
  projectName: string;
  userEmail: string;
}

export interface ProjectInvitationNotificationData {
  projectId: string;
  projectName: string;
  userEmail: string;
}

export interface RemovedFromProjectNotificationData {
  projectName: string;
  userEmail: string;
}
