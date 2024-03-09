import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  json,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { projects } from "../projects/schema";

export const posts = pgTable(
  "posts",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    projectId: varchar("projectId", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: json("content").$type<any>().notNull(),
    thumbnailUrl: text("thumbnailUrl"),
    hidden: boolean("hidden").default(true).notNull(),
    seoTitle: varchar("seoTitle", { length: 255 }),
    seoDescription: varchar("seoDescription", { length: 255 }),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      projectIdIdx: index("projectId_index").on(table.projectId),
    };
  },
);

export const postsRelations = relations(posts, ({ one }) => ({
  project: one(projects, {
    fields: [posts.projectId],
    references: [projects.id],
  }),
}));
