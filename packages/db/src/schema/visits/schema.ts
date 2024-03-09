import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { posts } from "../posts/schema";
import { projects } from "../projects/schema";

export const visits = pgTable(
  "visits",
  {
    id: serial("id").primaryKey().notNull(),
    projectId: varchar("projectId", { length: 255 }).notNull(),
    postId: varchar("postId", { length: 255 }),
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
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    referer: varchar("referer", { length: 255 }),
  },
  (table) => {
    return {
      projectIdIdx: index("projectId_idx").on(table.projectId),
      postIdIdx: index("visits_postId_idx").on(table.postId),
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
