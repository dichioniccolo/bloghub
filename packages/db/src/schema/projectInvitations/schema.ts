import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { projects } from "../projects/schema";

export const projectInvitations = pgTable(
  "projectInvitations",
  {
    projectId: varchar("projectId", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    expiresAt: timestamp("expiresAt", { mode: "date", precision: 3 }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
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
