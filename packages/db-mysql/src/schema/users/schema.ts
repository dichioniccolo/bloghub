import { relations, sql } from "drizzle-orm";
import {
  datetime,
  mysqlTable,
  primaryKey,
  text,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

import { accounts } from "../accounts/schema";
import { emailNotificationSettings } from "../emailNotificationSettings/schema";
import { likes } from "../likes/schema";
import { notifications } from "../notifications/schema";
import { projectMembers } from "../projectMembers/schema";
import { session } from "../session/schema";

export const users = mysqlTable(
  "user",
  {
    id: varchar("id", { length: 255 }).notNull(),
    name: text("name"),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: datetime("emailVerified", { mode: "date", fsp: 3 }),
    image: text("image"),
    stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
    stripePriceId: varchar("stripePriceId", { length: 255 }),
    dayWhenBillingStarts: datetime("dayWhenBillingStarts", {
      mode: "date",
      fsp: 3,
    })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "date", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      userIdPk: primaryKey({ columns: [table.id], name: "user_id_pk" }),
      emailUniqueIndex: unique("email_unique_index").on(table.email),
      userStripeCustomerIdKey: unique("user_stripeCustomerId_key").on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(session),
  accounts: many(accounts),
  projects: many(projectMembers),
  notifications: many(notifications),
  likes: many(likes),
  emailNotificationSettings: many(emailNotificationSettings),
}));
