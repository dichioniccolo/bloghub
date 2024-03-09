import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { projects } from "../projects/schema";
import { users } from "../users/schema";

export const automaticEmailTypeEnum = pgEnum("automaticEmailType", [
  "INVALID_DOMAIN",
  "NEAR_MONTHLY_LIMIT",
  "MONTHLY_LIMIT_REACHED",
]);

export const automaticEmails = pgTable(
  "automaticEmails",
  {
    id: serial("id").primaryKey().notNull(),
    type: automaticEmailTypeEnum("type").notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    projectId: varchar("projectId", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("automaticEmails_userId_idx").on(table.userId),
      projectIdIdx: index("automaticEmails_projectId_idx").on(table.projectId),
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
