import { relations } from "drizzle-orm";
import {
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

import { users } from "../users/schema";

export const emailNotificationSettings = mysqlTable(
  "emailNotificationSettings",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: mysqlEnum("type", [
      "COMMUNICATION",
      "MARKETING",
      "SOCIAL",
      "SECURITY",
    ]).notNull(),
    value: tinyint("value").default(1).notNull(),
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
