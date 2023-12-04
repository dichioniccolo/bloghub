import { relations, sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

import { user } from "../user/schema";

export const session = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 500 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: datetime("expires", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("session_userId_idx").on(table.userId),
      sessionSessionTokenPk: primaryKey({
        columns: [table.sessionToken],
        name: "session_sessionToken_pk",
      }),
    };
  },
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
