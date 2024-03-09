import { pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 500 }).notNull(),
    expires: timestamp("expires", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      verificationTokenIdentifierTokenPk: primaryKey({
        columns: [table.identifier, table.token],
        name: "verificationToken_identifier_token_pk",
      }),
    };
  },
);
