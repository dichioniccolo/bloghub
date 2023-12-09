import { relations } from "drizzle-orm";
import {
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

import { projects } from "../projects/schema";

export const projectSocials = mysqlTable(
  "projectSocials",
  {
    projectId: varchar("projectId", { length: 255 }).notNull(),
    social: mysqlEnum("social", [
      "GITHUB",
      "TWITTER",
      "DISCORD",
      "YOUTUBE",
      "LINKEDIN",
      "FACEBOOK",
      "INSTAGRAM",
    ]).notNull(),
    value: text("value").notNull(),
  },
  (table) => {
    return {
      projectSocialsProjectIdSocialPk: primaryKey({
        columns: [table.projectId, table.social],
        name: "projectSocials_projectId_social_pk",
      }),
      projectSocialsProjectIdSocialIdx: index(
        "projectSocials_projectId_social_idx",
      ).on(table.projectId, table.social),
      projectSocialsProjectIdIdx: index("projectSocials_projectId_idx").on(
        table.projectId,
      ),
      projectSocialsProjectIdSocialUniqueIndex: unique(
        "projectSocials_projectId_social_unique_index",
      ).on(table.projectId, table.social),
    };
  },
);

export const projectSocialsRelations = relations(projectSocials, ({ one }) => ({
  project: one(projects, {
    fields: [projectSocials.projectId],
    references: [projects.id],
  }),
}));
