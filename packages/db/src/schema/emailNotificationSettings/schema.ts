import {
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

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
