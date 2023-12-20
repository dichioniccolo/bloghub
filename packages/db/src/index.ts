import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "./env.mjs";
import { accountRelations, accounts } from "./schema/accounts/schema";
import {
  automaticEmails,
  automaticEmailsRelations,
} from "./schema/automaticEmails/schema";
import {
  emailNotificationSettings,
  emailNotificationSettingsRelations,
} from "./schema/emailNotificationSettings/schema";
import { likes, likesRelations } from "./schema/likes/schema";
import { media, mediaRelations } from "./schema/media/schema";
import {
  notifications,
  notificationsRelations,
} from "./schema/notifications/schema";
import { posts, postsRelations } from "./schema/posts/schema";
import {
  projectInvitations,
  projectInvitationsRelations,
} from "./schema/projectInvitations/schema";
import {
  projectMembers,
  projectMembersRelations,
} from "./schema/projectMembers/schema";
import { projects, projectsRelations } from "./schema/projects/schema";
import {
  projectSocials,
  projectSocialsRelations,
} from "./schema/projectSocials/schema";
import { session, sessionRelations } from "./schema/session/schema";
import { userRelations, users } from "./schema/users/schema";
import { verificationTokens } from "./schema/verificationTokens/schema";
import { visits, visitsRelations } from "./schema/visits/schema";

const client = new Client({
  url: env.DATABASE_URL,
});

export const schema = {
  account: accounts,
  accountRelations,

  automaticEmails,
  automaticEmailsRelations,

  emailNotificationSettings,
  emailNotificationSettingsRelations,

  likes,
  likesRelations,

  media,
  mediaRelations,

  notifications,
  notificationsRelations,

  posts,
  postsRelations,

  projectInvitations,
  projectInvitationsRelations,

  projectMembers,
  projectMembersRelations,

  projects,
  projectsRelations,

  session,
  sessionRelations,

  user: users,
  userRelations,

  verificationToken: verificationTokens,

  visits,
  visitsRelations,

  projectSocials,
  projectSocialsRelations,
};

export const db = drizzle(client.connection(), {
  schema,
  logger: true,
});

export { createId } from "@paralleldrive/cuid2";

export * from "drizzle-orm";

export * from "./helpers";

export * from "./types";
