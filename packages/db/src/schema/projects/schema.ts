import { relations, sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlTable,
  primaryKey,
  text,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

import { customCuid2 } from "../custom-types";
import { media } from "../media/schema";
import { posts } from "../posts/schema";
import { projectInvitations } from "../projectInvitations/schema";
import { projectMembers } from "../projectMembers/schema";

export const projects = mysqlTable(
  "projects",
  {
    id: customCuid2("id", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    logo: text("logo"),
    domain: varchar("domain", { length: 255 }).notNull(),
    domainVerified: tinyint("domainVerified").default(0).notNull(),
    domainLastCheckedAt: datetime("domainLastCheckedAt", {
      mode: "date",
      fsp: 3,
    }),
    domainUnverifiedAt: datetime("domainUnverifiedAt", {
      mode: "date",
      fsp: 3,
    }),
    createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "date", fsp: 3 }).notNull(),
    deletedAt: datetime("deletedAt", { mode: "date", fsp: 3 }),
  },
  (table) => {
    return {
      deletedAtIdx: index("deleted_at_index").on(table.deletedAt),
      projectsIdPk: primaryKey({ columns: [table.id], name: "projects_id_pk" }),
    };
  },
);

export const projectsRelations = relations(projects, ({ many }) => ({
  projectMembers: many(projectMembers),
  projectInvitations: many(projectInvitations),
  posts: many(posts),
  media: many(media),
}));
