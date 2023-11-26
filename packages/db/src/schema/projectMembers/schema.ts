import { relations, sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

import { projects } from "../projects/schema";
import { user } from "../user/schema";

export const projectMembers = mysqlTable(
  "projectMembers",
  {
    projectId: varchar("projectId", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["OWNER", "EDITOR"]).default("EDITOR").notNull(),
    createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
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
  user: one(user, {
    fields: [projectMembers.userId],
    references: [user.id],
  }),
}));
