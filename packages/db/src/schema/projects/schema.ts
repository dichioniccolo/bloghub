import { sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlTable,
  primaryKey,
  text,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

export const projects = mysqlTable(
  "projects",
  {
    id: varchar("id", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    logo: text("logo"),
    domain: varchar("domain", { length: 255 }).notNull(),
    domainVerified: tinyint("domainVerified").default(0).notNull(),
    domainLastCheckedAt: datetime("domainLastCheckedAt", {
      mode: "string",
      fsp: 3,
    }),
    domainUnverifiedAt: datetime("domainUnverifiedAt", {
      mode: "string",
      fsp: 3,
    }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    deletedAt: datetime("deletedAt", { mode: "string", fsp: 3 }),
  },
  (table) => {
    return {
      deletedAtIdx: index("deleted_at_index").on(table.deletedAt),
      projectsIdPk: primaryKey({ columns: [table.id], name: "projects_id_pk" }),
    };
  },
);
