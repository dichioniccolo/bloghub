import { relations } from "drizzle-orm";
import {
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  tinyint,
} from "drizzle-orm/mysql-core";

import { customCuid2 } from "../custom-types";
import { user } from "../user/schema";

export const emailNotificationSettings = mysqlTable(
  "emailNotificationSettings",
  {
    userId: customCuid2("userId", { length: 255 }).notNull(),
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
    user: one(user, {
      fields: [emailNotificationSettings.userId],
      references: [user.id],
    }),
  }),
);
