import { relations } from "drizzle-orm";
import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { users } from "../users/schema";

export const session = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 500 })
      .primaryKey()
      .notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("session_userId_idx").on(table.userId),
    };
  },
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(users, {
    fields: [session.userId],
    references: [users.id],
  }),
}));
