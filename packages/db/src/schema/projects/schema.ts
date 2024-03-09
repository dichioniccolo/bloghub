import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { media } from "../media/schema";
import { posts } from "../posts/schema";
import { projectInvitations } from "../projectInvitations/schema";
import { projectMembers } from "../projectMembers/schema";
import { projectSocials } from "../projectSocials/schema";

export const projects = pgTable(
  "projects",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    logo: text("logo"),
    domain: varchar("domain", { length: 255 }).notNull(),
    domainVerified: boolean("domainVerified").default(false).notNull(),
    domainLastCheckedAt: timestamp("domainLastCheckedAt", {
      mode: "date",
      precision: 3,
    }),
    domainUnverifiedAt: timestamp("domainUnverifiedAt", {
      mode: "date",
      precision: 3,
    }),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
  },
  (table) => {
    return {
      deletedAtIdx: index("deleted_at_index").on(table.deletedAt),
    };
  },
);

export const projectsRelations = relations(projects, ({ many }) => ({
  members: many(projectMembers),
  invitations: many(projectInvitations),
  posts: many(posts),
  media: many(media),
  socials: many(projectSocials),
}));
