import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

import { projects } from "../projects/schema";
import { users } from "../users/schema";

export const roleEnum = pgEnum("role", ["OWNER", "EDITOR"]);

export const projectMembers = pgTable(
  "projectMembers",
  {
    projectId: varchar("projectId", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    role: roleEnum("role").default("EDITOR").notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      projectIdUserIdRoleIdx: index(
        "projectMembers_projectId_userId_role_idx",
      ).on(table.projectId, table.userId, table.role),
      projectIdIdx: index("projectMembers_projectId_idx").on(table.projectId),
      userIdIdx: index("projectMembers_userId_idx").on(table.userId),
      projectMembersProjectIdUserIdPk: primaryKey({
        columns: [table.projectId, table.userId],
        name: "projectMembers_projectId_userId_pk",
      }),
      projectMembersUniqueIndex: unique("projectMembers_unique_index").on(
        table.projectId,
        table.userId,
      ),
    };
  },
);

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));
