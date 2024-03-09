import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";

import { accounts } from "../accounts/schema";
import { emailNotificationSettings } from "../emailNotificationSettings/schema";
import { likes } from "../likes/schema";
import { notifications } from "../notifications/schema";
import { projectMembers } from "../projectMembers/schema";
import { session } from "../session/schema";

export const users = pgTable(
  "user",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    name: text("name"),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date", precision: 3 }),
    image: text("image"),
    stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
    stripePriceId: varchar("stripePriceId", { length: 255 }),
    dayWhenBillingStarts: timestamp("dayWhenBillingStarts", {
      mode: "date",
      precision: 3,
    })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
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
