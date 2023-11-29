import { relations, sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlTable,
  primaryKey,
  serial,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

import { customCuid2 } from "../custom-types";
import { posts } from "../posts/schema";
import { projects } from "../projects/schema";

export const visits = mysqlTable(
  "visits",
  {
    id: serial("id").notNull(),
    projectId: customCuid2("projectId", { length: 255 }).notNull(),
    postId: customCuid2("postId", { length: 255 }),
    browserName: varchar("browserName", { length: 255 }),
    browserVersion: varchar("browserVersion", { length: 255 }),
    osName: varchar("osName", { length: 255 }),
    osVersion: varchar("osVersion", { length: 255 }),
    deviceModel: varchar("deviceModel", { length: 255 }),
    deviceType: varchar("deviceType", { length: 255 }),
    deviceVendor: varchar("deviceVendor", { length: 255 }),
    engineName: varchar("engineName", { length: 255 }),
    engineVersion: varchar("engineVersion", { length: 255 }),
    cpuArchitecture: varchar("cpuArchitecture", { length: 255 }),
    geoCountry: varchar("geoCountry", { length: 255 }),
    geoRegion: varchar("geoRegion", { length: 255 }),
    geoCity: varchar("geoCity", { length: 255 }),
    geoLatitude: varchar("geoLatitude", { length: 255 }),
    geoLongitude: varchar("geoLongitude", { length: 255 }),
    createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    referer: varchar("referer", { length: 255 }),
  },
  (table) => {
    return {
      projectIdIdx: index("projectId_index").on(table.projectId),
      postIdIdx: index("visits_postId_idx").on(table.postId),
      visitsIdPk: primaryKey({ columns: [table.id], name: "visits_id_pk" }),
      id: unique("id").on(table.id),
    };
  },
);

export const visitsRelations = relations(visits, ({ one }) => ({
  project: one(projects, {
    fields: [visits.projectId],
    references: [projects.id],
  }),
  post: one(posts, {
    fields: [visits.postId],
    references: [posts.id],
  }),
}));
