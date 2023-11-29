import { relations } from "drizzle-orm";
import {
  index,
  int,
  mysqlTable,
  primaryKey,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

import { customCuid2 } from "../custom-types";
import { user } from "../user/schema";

export const account = mysqlTable(
  "account",
  {
    userId: customCuid2("userId", { length: 255 }).notNull(),
    // varchar("userId", { length: 255 }).notNull(),
    type: text("type").notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: int("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => {
    return {
      userIdIdx: index("account_userId_idx").on(table.userId),
      accountProviderProviderAccountIdPk: primaryKey({
        columns: [table.provider, table.providerAccountId],
        name: "account_provider_providerAccountId_pk",
      }),
    };
  },
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
