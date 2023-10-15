import type { Adapter } from "@auth/core/adapters";

import type { db } from "../";
import {
  accounts,
  and,
  eq,
  genId,
  sessions,
  users,
  verificationTokens,
} from "../";

export type DbClient = typeof db;

export const defaultSchema = { users, accounts, sessions, verificationTokens };
export type DefaultSchema = typeof defaultSchema;

export function PlanetScaleAdapter(
  client: DbClient,
  schema?: Partial<NonNullable<DefaultSchema>>,
): Adapter {
  const { users, accounts, sessions, verificationTokens } = {
    users: schema?.users ?? defaultSchema.users,
    accounts: schema?.accounts ?? defaultSchema.accounts,
    sessions: schema?.sessions ?? defaultSchema.sessions,
    verificationTokens:
      schema?.verificationTokens ?? defaultSchema.verificationTokens,
  };

  return {
    createUser: async (data) => {
      const id = genId();

      await client.insert(users).values({ ...data, id });

      return client
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then((res) => res[0]!);
    },
    getUser: async (data) => {
      return client
        .select()
        .from(users)
        .where(eq(users.id, data))
        .then((res) => res[0] ?? null);
    },
    getUserByEmail: async (data) => {
      return client
        .select()
        .from(users)
        .where(eq(users.email, data))
        .then((res) => res[0] ?? null);
    },
    createSession: async (data) => {
      await client.insert(sessions).values(data);

      return client
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .then((res) => res[0]!);
    },
    getSessionAndUser: async (data) => {
      return client
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .then((res) => res[0] ?? null);
    },
    updateUser: async (data) => {
      if (!data.id) {
        throw new Error("No user id.");
      }

      await client.update(users).set(data).where(eq(users.id, data.id));

      return client
        .select()
        .from(users)
        .where(eq(users.id, data.id))
        .then((res) => res[0]!);
    },
    updateSession: async (data) => {
      await client
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken));

      return client
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .then((res) => res[0]!);
    },
    linkAccount: async (rawAccount) => {
      await client.insert(accounts).values(rawAccount);

      const updatedAccount = await client
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, rawAccount.providerAccountId),
            eq(accounts.provider, rawAccount.provider),
          ),
        )
        .then((res) => res[0]!);

      // Drizzle will return `null` for fields that are not defined.
      // However, the return type is expecting `undefined`.
      const account = {
        ...updatedAccount,
        access_token: updatedAccount.access_token ?? undefined,
        token_type: updatedAccount.token_type ?? undefined,
        id_token: updatedAccount.id_token ?? undefined,
        refresh_token: updatedAccount.refresh_token ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expires_at ?? undefined,
        session_state: updatedAccount.session_state ?? undefined,
      };

      return account;
    },
    getUserByAccount: async (account) => {
      const dbAccount = await client
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider),
          ),
        )
        .leftJoin(users, eq(accounts.userId, users.id))
        .then((res) => res[0]);

      return dbAccount!.users;
    },
    deleteSession: async (sessionToken) => {
      await client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken));
    },
    createVerificationToken: async (token) => {
      await client.insert(verificationTokens).values(token);

      return client
        .select()
        .from(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, token.identifier),
            eq(verificationTokens.token, token.token),
          ),
        )
        .then((res) => res[0]!);
    },
    useVerificationToken: async (token) => {
      try {
        const deletedToken = await client
          .select()
          .from(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token),
            ),
          )
          .then((res) => res[0] ?? null);

        await client
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token),
            ),
          );

        return deletedToken;
      } catch (err) {
        throw new Error("No verification token found.");
      }
    },
    deleteUser: async (id) => {
      await client.delete(users).where(eq(users.id, id));
    },
    unlinkAccount: async (account) => {
      await client
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider),
          ),
        );

      return undefined;
    },
  };
}
