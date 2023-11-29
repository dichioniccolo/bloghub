import { relations } from "drizzle-orm";
import {
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  unique,
} from "drizzle-orm/mysql-core";

import { customCuid2 } from "../custom-types";
import { projects } from "../projects/schema";
import { user } from "../user/schema";

export const automaticEmails = mysqlTable(
  "automaticEmails",
  {
    id: serial("id").notNull(),
    type: mysqlEnum("type", [
      "INVALID_DOMAIN",
      "NEAR_MONTHLY_LIMIT",
      "MONTHLY_LIMIT_REACHED",
    ]).notNull(),
    userId: customCuid2("userId", { length: 255 }).notNull(),
    projectId: customCuid2("projectId", { length: 255 }).notNull(),
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
    user: one(user, {
      fields: [automaticEmails.userId],
      references: [user.id],
    }),
    project: one(projects, {
      fields: [automaticEmails.projectId],
      references: [projects.id],
    }),
  }),
);
