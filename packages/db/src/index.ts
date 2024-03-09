import { neon, Pool } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/neon-serverless";

import { env } from "./env.mjs";
import * as accountsPostgres from "./schema/accounts/schema";
import * as automaticEmailsPostgres from "./schema/automaticEmails/schema";
import * as emailNotificationSettingsPostgres from "./schema/emailNotificationSettings/schema";
import * as likesPostgres from "./schema/likes/schema";
import * as mediaPostgres from "./schema/media/schema";
import * as notificationsPostgres from "./schema/notifications/schema";
import * as postsPostgres from "./schema/posts/schema";
import * as projectInvitationsPostgres from "./schema/projectInvitations/schema";
import * as projectMembersPostgres from "./schema/projectMembers/schema";
import * as projectsPostgres from "./schema/projects/schema";
import * as projectSocialsPostgres from "./schema/projectSocials/schema";
import * as sessionsPostgres from "./schema/session/schema";
import * as usersPostgres from "./schema/users/schema";
import * as verificationTokensPostgres from "./schema/verificationTokens/schema";
import * as visitsPostgres from "./schema/visits/schema";

export const schema = {
  ...accountsPostgres,
  ...automaticEmailsPostgres,
  ...emailNotificationSettingsPostgres,
  ...likesPostgres,
  ...mediaPostgres,
  ...notificationsPostgres,
  ...postsPostgres,
  ...projectInvitationsPostgres,
  ...projectMembersPostgres,
  ...projectsPostgres,
  ...projectSocialsPostgres,
  ...sessionsPostgres,
  ...usersPostgres,
  ...verificationTokensPostgres,
  ...visitsPostgres,
};

const pool = new Pool({
  connectionString: env.DATABASE_URL_POSTGRES,
});

export const db = drizzle(pool, {
  schema,
});

const sql = neon(env.DATABASE_URL_POSTGRES);
// @ts-expect-error dunno
export const dbHttp = drizzleHttp(sql, {
  schema,
});

export { createId } from "@paralleldrive/cuid2";

export * from "drizzle-orm";

export * from "./helpers";

export * from "./types";
