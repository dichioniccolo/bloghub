import { serve } from "inngest/next";

import { inngest } from "@acme/inngest";

import { cleanupFunction } from "./functions/cleanup";
import { domainVerification } from "./functions/domain-verification";
import { invitationAcceptedNotification } from "./functions/notifications/invitation.accepted";
import { projectInvitationNotification } from "./functions/notifications/project.invitation";
import { removedFromProjectNotification } from "./functions/notifications/project.user.removed";
import { postUpdate } from "./functions/post/update";
import { postUpdateSettings } from "./functions/post/update.settings";
import { projectDelete } from "./functions/project/delete";
import { projectUpdateLogo } from "./functions/project/update.logo";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const { GET, POST, PUT } = serve(inngest, [
  projectInvitationNotification,
  invitationAcceptedNotification,
  removedFromProjectNotification,
  cleanupFunction,
  domainVerification,
  projectDelete,
  projectUpdateLogo,
  postUpdate,
  postUpdateSettings,
]);
