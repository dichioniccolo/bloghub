import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "../users/schema";

export const emailNotificationTypeEnum = pgEnum("emailNotificationType", [
  "COMMUNICATION",
  "MARKETING",
  "SOCIAL",
  "SECURITY",
]);

export const emailNotificationSettings = pgTable(
  "emailNotificationSettings",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: emailNotificationTypeEnum("type").notNull(),
    value: boolean("value").default(true).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("emailNotificationSettings_userId_idx").on(table.userId),
      emailNotificationSettingsTypeUserIdPk: primaryKey({
        columns: [table.type, table.userId],
        name: "emailNotificationSettings_type_userId_pk",
      }),
    };
  },
);

export const emailNotificationSettingsRelations = relations(
  emailNotificationSettings,
  ({ one }) => ({
    user: one(users, {
      fields: [emailNotificationSettings.userId],
      references: [users.id],
    }),
  }),
);
