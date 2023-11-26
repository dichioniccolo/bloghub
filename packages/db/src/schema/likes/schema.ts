import { sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

export const likes = mysqlTable(
  "likes",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    postId: varchar("postId", { length: 255 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
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
