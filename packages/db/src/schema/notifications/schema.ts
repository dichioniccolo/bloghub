import { relations } from "drizzle-orm";
import {
  index,
  json,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "../users/schema";

export const notificationTypeEnum = pgEnum("notificationType", [
  "PROJECT_INVITATION",
  "REMOVED_FROM_PROJECT",
  "INVITATION_ACCEPTED",
]);

export const notificationStatusEnum = pgEnum("notificationStatus", [
  "UNREAD",
  "READ",
  "ARCHIVED",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    type: notificationTypeEnum("type").notNull(),
    status: notificationStatusEnum("status").default("UNREAD").notNull(),
    body: json("body").notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("notifications_userId_idx").on(table.userId),
    };
  },
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
