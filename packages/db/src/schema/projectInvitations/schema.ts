import { relations, sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

import { projects } from "../projects/schema";

export const projectInvitations = mysqlTable(
  "projectInvitations",
  {
    projectId: varchar("projectId", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    expiresAt: datetime("expiresAt", { mode: "date", fsp: 3 }).notNull(),
    createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      projectIdIdx: index("projectInvitations_projectId_idx").on(
        table.projectId,
      ),
      projectInvitationsEmailProjectIdPk: primaryKey({
        columns: [table.email, table.projectId],
        name: "projectInvitations_email_projectId_pk",
      }),
    };
  },
);

export const projectInvitationsRelations = relations(
  projectInvitations,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectInvitations.projectId],
      references: [projects.id],
    }),
  }),
);
