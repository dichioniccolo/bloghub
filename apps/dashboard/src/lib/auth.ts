import type { JWT } from "@auth/core/jwt";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";

import {
  accounts,
  db,
  eq,
  PlanetScaleAdapter,
  sessions,
  users,
  verificationTokens,
} from "@acme/db";
import { inngest } from "@acme/inngest";

import { isEmailBlacklisted } from "./utils";

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

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    sub: string;
    id: string;
    email: string;
  }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthConfig = {
  providers: [
    {
      id: "email",
      type: "email",
      name: "Email",
      server: { host: "", port: 0, auth: { user: "", pass: "" } },
      from: "",
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier, url }) {
        await inngest.send({
          name: "user/login-link",
          data: {
            email: identifier,
            url,
          },
        });
      },
      options: {},
    },
  ],
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
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }

      const isBlacklisted = await isEmailBlacklisted(user.email);

      if (isBlacklisted) {
        return false;
      }

      if (account?.provider === "google") {
        if (profile?.email_verified) {
          return true;
        }

        const existingUser = await db
          .select({
            name: users.name,
            image: users.image,
          })
          .from(users)
          .where(eq(users.email, user.email))
          .then((x) => x[0]);

        if (existingUser && !existingUser.name) {
          await db
            .update(users)
            .set({
              name: profile?.name,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              image: profile?.picture ?? profile?.image ?? users.image,
            })
            .where(eq(users.email, user.email));
        }
      }

      return true;
    },
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
      if (!token.email) {
        throw new Error("Unable to sign in with this email address");
      }

      const isBlacklisted = await isEmailBlacklisted(token.email);

      if (isBlacklisted) {
        throw new Error("Unable to sign in with this email address");
      }

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
};

export const { handlers: authHandlers, auth } = NextAuth(authOptions);
