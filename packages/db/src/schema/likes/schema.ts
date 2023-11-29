import { relations, sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlTable,
  primaryKey,
} from "drizzle-orm/mysql-core";

import { customCuid2 } from "../custom-types";
import { posts } from "../posts/schema";
import { user } from "../user/schema";

export const likes = mysqlTable(
  "likes",
  {
    userId: customCuid2("userId", { length: 255 }).notNull(),
    postId: customCuid2("postId", { length: 255 }).notNull(),
    createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
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
  user: one(user, {
    fields: [likes.userId],
    references: [user.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));
