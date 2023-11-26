import { sql } from "drizzle-orm";
import {
  datetime,
  index,
  json,
  mysqlTable,
  primaryKey,
  text,
  tinyint,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const posts = mysqlTable(
  "posts",
  {
    id: varchar("id", { length: 255 }).notNull(),
    projectId: varchar("projectId", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    content: json("content").notNull(),
    thumbnailUrl: text("thumbnailUrl"),
    slug: varchar("slug", { length: 255 }).notNull(),
    hidden: tinyint("hidden").default(1).notNull(),
    seoTitle: varchar("seoTitle", { length: 255 }),
    seoDescription: varchar("seoDescription", { length: 255 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      projectIdIdx: index("projectId_index").on(table.projectId),
      postsIdPk: primaryKey({ columns: [table.id], name: "posts_id_pk" }),
      postsUniqueIndex: unique("posts_unique_index").on(
        table.projectId,
        table.slug,
      ),
    };
  },
);
