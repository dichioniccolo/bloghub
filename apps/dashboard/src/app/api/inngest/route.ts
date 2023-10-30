import { serve } from "inngest/next";

import { inngest } from "@acme/inngest";

import { domainVerification } from "./functions/domain-verification";
import { mediaDeleteUnused } from "./functions/media/delete-unused";
import { notificationInvitationAccepted } from "./functions/notifications/invitation.accepted";
import { notificationInvitation } from "./functions/notifications/project.invitation";
import { notificationRemovedFromProject } from "./functions/notifications/project.user.removed";
import { projectDelete } from "./functions/project/delete";
import { userLoginLink } from "./functions/user/login-link";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    mediaDeleteUnused,
    notificationInvitationAccepted,
    notificationInvitation,
    notificationRemovedFromProject,
    projectDelete,
    userLoginLink,
    domainVerification,
  ],
});
