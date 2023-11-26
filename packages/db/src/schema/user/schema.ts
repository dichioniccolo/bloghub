import { sql } from "drizzle-orm";
import {
  datetime,
  mysqlTable,
  primaryKey,
  text,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable(
  "user",
  {
    id: varchar("id", { length: 255 }).notNull(),
    name: text("name"),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: datetime("emailVerified", { mode: "string", fsp: 3 }),
    image: text("image"),
    stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
    stripePriceId: varchar("stripePriceId", { length: 255 }),
    dayWhenBillingStarts: datetime("dayWhenBillingStarts", {
      mode: "string",
      fsp: 3,
    })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
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
