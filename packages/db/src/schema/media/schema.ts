import { relations, sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
} from "drizzle-orm/mysql-core";

import { customCuid2 } from "../custom-types";
import { posts } from "../posts/schema";
import { projects } from "../projects/schema";

export const media = mysqlTable(
  "media",
  {
    id: customCuid2("id", { length: 255 }).notNull(),
    projectId: customCuid2("projectId", { length: 255 }),
    postId: customCuid2("postId", { length: 255 }),
    type: mysqlEnum("type", ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT"])
      .default("IMAGE")
      .notNull(),
    url: text("url").notNull(),
    createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    forEntity: mysqlEnum("forEntity", [
      "POST_CONTENT",
      "POST_THUMBNAIL",
      "PROJECT_LOGO",
    ])
      .default("POST_CONTENT")
      .notNull(),
  },
  (table) => {
    return {
      projectIdIdx: index("media_projectId_idx").on(table.projectId),
      postIdIdx: index("media_postId_idx").on(table.postId),
      mediaIdPk: primaryKey({ columns: [table.id], name: "media_id_pk" }),
    };
  },
);

export const mediaRelations = relations(media, ({ one }) => ({
  project: one(projects, {
    fields: [media.projectId],
    references: [projects.id],
  }),
  post: one(posts, {
    fields: [media.postId],
    references: [posts.id],
  }),
}));
