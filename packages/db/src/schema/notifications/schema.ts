import { sql } from "drizzle-orm";
import {
  datetime,
  index,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

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
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
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
