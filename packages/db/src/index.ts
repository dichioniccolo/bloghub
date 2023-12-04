import { Client } from "@planetscale/database";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "./env.mjs";
import { account, accountRelations } from "./schema/account/schema";
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
import { session, sessionRelations } from "./schema/session/schema";
import { user, userRelations } from "./schema/user/schema";
import { verificationToken } from "./schema/verificationToken/schema";
import { visits, visitsRelations } from "./schema/visits/schema";

const drizzleDbClient = new Client({
  url: env.DRIZZLE_DATABASE_URL,
});

export const schema = {
  account,
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

  user,
  userRelations,

  verificationToken,

  visits,
  visitsRelations,
};

export const drizzleDb = drizzle(drizzleDbClient.connection(), {
  schema,
  logger: true,
});

const prismaDbClient = new Client({
  url: env.DATABASE_URL,
});

const adapter = new PrismaPlanetScale(prismaDbClient);

export const db = new PrismaClient({
  adapter,
}).$extends(withAccelerate());

// export * from "@prisma/client/edge";

export { createId } from "@paralleldrive/cuid2";

export * from "drizzle-orm";

export * from "./helpers";

export * from "./types";
