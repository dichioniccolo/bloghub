import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { posts } from "../posts/schema";
import { users } from "../users/schema";

export const likes = pgTable(
  "likes",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    postId: varchar("postId", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      postIdIdx: index("postId_index").on(table.postId),
      userIdIdx: index("likes_userId_idx").on(table.userId),
      likesPostIdUserIdPk: primaryKey({
        columns: [table.postId, table.userId],
        name: "likes_postId_userId_pk",
      }),
    };
  },
);

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));
