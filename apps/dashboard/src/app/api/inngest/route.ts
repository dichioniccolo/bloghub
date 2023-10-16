import { serve } from "inngest/next";

import { inngest } from "@acme/inngest";

import { domainVerification } from "./functions/domain-verification";
import { notificationInvitationAccepted } from "./functions/notifications/invitation.accepted";
import { notificationInvitation } from "./functions/notifications/project.invitation";
import { notificationRemovedFromProject } from "./functions/notifications/project.user.removed";
import { postCreate } from "./functions/post/create";
import { postDelete } from "./functions/post/delete";
import { projectDelete } from "./functions/project/delete";
import { userLoginLink } from "./functions/user/login-link";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // mediaDeleteUnused,
    notificationInvitationAccepted,
    notificationInvitation,
    notificationRemovedFromProject,
    postCreate,
    postDelete,
    projectDelete,
    userLoginLink,
    domainVerification,
  ],
});
