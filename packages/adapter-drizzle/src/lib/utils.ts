/* eslint-disable @typescript-eslint/no-explicit-any */
import { PgDatabase, type AnyPgTable } from "drizzle-orm/pg-core";

import { type Schema as PgSchema } from "./pg/schema";

export type AnyPgDatabase = PgDatabase<any, any, any>;

export interface MinimumSchema {
  pg: PgSchema & Record<string, AnyPgTable>;
}

export type SqlFlavorOptions = AnyPgDatabase;

export type ClientFlavors<Flavor> = Flavor extends AnyPgDatabase
  ? MinimumSchema["pg"]
  : never;

export function isPgDatabase(db: any): db is PgDatabase<any, PgSchema, any> {
  return db instanceof PgDatabase;
}
