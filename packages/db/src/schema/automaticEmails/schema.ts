import { relations } from "drizzle-orm";
import {
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

import { projects } from "../projects/schema";
import { users } from "../users/schema";

export const automaticEmails = mysqlTable(
  "automaticEmails",
  {
    id: serial("id").notNull(),
    type: mysqlEnum("type", [
      "INVALID_DOMAIN",
      "NEAR_MONTHLY_LIMIT",
      "MONTHLY_LIMIT_REACHED",
    ]).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    projectId: varchar("projectId", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("automaticEmails_userId_idx").on(table.userId),
      projectIdIdx: index("automaticEmails_projectId_idx").on(table.projectId),
      automaticEmailsIdPk: primaryKey({
        columns: [table.id],
        name: "automaticEmails_id_pk",
      }),
      id: unique("id").on(table.id),
    };
  },
);

export const automaticEmailsRelations = relations(
  automaticEmails,
  ({ one }) => ({
    user: one(users, {
      fields: [automaticEmails.userId],
      references: [users.id],
    }),
    project: one(projects, {
      fields: [automaticEmails.projectId],
      references: [projects.id],
    }),
  }),
);
