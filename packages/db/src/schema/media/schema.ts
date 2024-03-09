import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { posts } from "../posts/schema";
import { projects } from "../projects/schema";

export const mediaTypeEnum = pgEnum("mediaType", [
  "IMAGE",
  "VIDEO",
  "AUDIO",
  "DOCUMENT",
]);

export const forEntityEnum = pgEnum("mediaForEntity", [
  "POST_CONTENT",
  "POST_THUMBNAIL",
  "PROJECT_LOGO",
]);

export const media = pgTable(
  "media",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    projectId: varchar("projectId", { length: 255 }),
    postId: varchar("postId", { length: 255 }),
    type: mediaTypeEnum("type").default("IMAGE").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    forEntity: forEntityEnum("forEntity").default("POST_CONTENT").notNull(),
  },
  (table) => {
    return {
      projectIdIdx: index("media_projectId_idx").on(table.projectId),
      postIdIdx: index("media_postId_idx").on(table.postId),
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
