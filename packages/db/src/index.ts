import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "./env.mjs";
import * as accounts from "./schema/accounts/schema";
import * as automaticEmails from "./schema/automaticEmails/schema";
import * as emailNotificationSettings from "./schema/emailNotificationSettings/schema";
import * as likes from "./schema/likes/schema";
import * as media from "./schema/media/schema";
import * as notifications from "./schema/notifications/schema";
import * as posts from "./schema/posts/schema";
import * as projectInvitations from "./schema/projectInvitations/schema";
import * as projectMembers from "./schema/projectMembers/schema";
import * as projects from "./schema/projects/schema";
import * as projectSocials from "./schema/projectSocials/schema";
import * as sessions from "./schema/session/schema";
import * as users from "./schema/users/schema";
import * as verificationTokens from "./schema/verificationTokens/schema";
import * as visits from "./schema/visits/schema";

const client = new Client({
  url: env.DATABASE_URL,
});

export const schema = {
  ...accounts,
  ...automaticEmails,
  ...emailNotificationSettings,
  ...likes,
  ...media,
  ...notifications,
  ...posts,
  ...projectInvitations,
  ...projectMembers,
  ...projectSocials,
  ...projects,
  ...sessions,
  ...users,
  ...verificationTokens,
  ...visits,
};

export const db = drizzle(client.connection(), {
  schema,
  // logger: true,
});

export { createId } from "@paralleldrive/cuid2";

export * from "drizzle-orm";

export * from "./helpers";

export * from "./types";
