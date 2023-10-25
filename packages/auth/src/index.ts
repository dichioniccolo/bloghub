import type { JWT } from "@auth/core/jwt";
import Discord from "@auth/core/providers/discord";
import type { DefaultSession } from "@auth/core/types";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";

import { db, eq, users } from "@acme/db";
import { inngest } from "@acme/inngest";

import { env } from "./env.mjs";

export type { Session } from "next-auth";

// Update this whenever adding new providers so that the client can
export const providers = ["discord"] as const;
export type OAuthProviders = (typeof providers)[number];

declare module "next-auth" {
  interface Session {
    user: {
      sub: string;
      id: string;
      email: string;
      picture?: string | null;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    newUser: "/welcome",
  },
  providers: [
    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
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
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (
        (account?.provider === "google" || account?.provider === "discord") &&
        profile
      ) {
        const existingUser = await db
          .select({
            name: users.name,
            image: users.image,
          })
          .from(users)
          .where(eq(users.email, profile.email!))
          .then((x) => x[0]);

        if (existingUser && !existingUser.name) {
          await db
            .update(users)
            .set({
              name: profile?.name,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              image:
                profile?.picture ??
                profile?.image ??
                profile?.image_url ??
                users.image,
            })
            .where(eq(users.email, profile.email!));
        }
      }

      return true;
    },

    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.sub!;
        session.user.name = token.name;
        session.user.email = token.email!;
        session.user.image = token.picture;
      }
      return session;
    },

    jwt: async ({ token, user }) => {
      if (!token.email) {
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

    // @TODO
    // authorized({ request, auth }) {
    //   return !!auth?.user
    // }
  },
});
