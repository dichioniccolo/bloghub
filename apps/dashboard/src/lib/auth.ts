import { createHash, randomBytes } from "crypto";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import type { DefaultJWT, JWT } from "next-auth/jwt";

import {
  accounts,
  db,
  eq,
  PlanetScaleAdapter,
  sessions,
  users,
  verificationTokens,
} from "@acme/db";
import { subdomainUrl } from "@acme/lib/url";

import { env } from "../env.mjs";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
    token: string;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    sub: string;
    id: string;
    email: string;
  }
}

export const COOKIE_AUTH_NAME =
  process.env.NODE_ENV === "development"
    ? "next-auth.session-token"
    : "__Secure-next-auth.session-token";

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions = {
  callbacks: {
    session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          image: users.image,
        })
        .from(users)
        .where(eq(users.email, token.email))
        .then((x) => x[0]);

      if (!dbUser) {
        if (user) {
          token.sub = user?.id;
        }

        return token;
      }

      return {
        sub: dbUser.id,
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        picture: dbUser.image,
      } as JWT;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: PlanetScaleAdapter(db, {
    users,
    accounts,
    sessions,
    verificationTokens,
  }),
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    newUser: "/welcome",
  },
} satisfies Omit<NextAuthOptions, "providers">;

export async function getLoginUrl(
  identifier: string,
  expires: Date,
  callbackUrl: string,
) {
  const token = randomBytes(32).toString("hex");

  await db.insert(verificationTokens).values({
    identifier,
    expires,
    token: createHash("sha256")
      .update(`${token}${env.NEXTAUTH_SECRET}`)
      .digest("hex"),
  });

  const params = new URLSearchParams({
    callbackUrl,
    email: identifier,
    token,
  });

  const url = `${subdomainUrl(
    "app",
  )}/api/auth/callback/email?${params.toString()}`;

  return url;
}
