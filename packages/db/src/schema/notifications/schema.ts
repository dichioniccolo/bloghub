import { relations, sql } from "drizzle-orm";
import {
  datetime,
  index,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

import { users } from "../users/schema";

export const notifications = mysqlTable(
  "notifications",
  {
    id: varchar("id", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    type: mysqlEnum("type", [
      "PROJECT_INVITATION",
      "REMOVED_FROM_PROJECT",
      "INVITATION_ACCEPTED",
    ]).notNull(),
    status: mysqlEnum("status", ["UNREAD", "READ", "ARCHIVED"])
      .default("UNREAD")
      .notNull(),
    body: json("body").notNull(),
    createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("notifications_userId_idx").on(table.userId),
      notificationsIdPk: primaryKey({
        columns: [table.id],
        name: "notifications_id_pk",
      }),
    };
  },
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
