import type { JWT } from "@auth/core/jwt";
import type { DefaultSession } from "@auth/core/types";
import Passkey from "@auth/core/providers/passkey";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { prisma } from "@acme/db";
import { inngest } from "@acme/inngest";

export type { Session } from "next-auth";

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
  signIn,
  signOut,
  unstable_update: updateSession,
} = NextAuth({
  experimental: {
    enableWebAuthn: true,
  },
  // @ts-expect-error dunno
  adapter: PrismaAdapter(prisma),
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
    Passkey,
    // Discord({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    //   allowDangerousEmailAccountLinking: true,
    // }),
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
        profile?.email
      ) {
        await prisma.user.update({
          where: {
            email: profile.email,
          },
          data: {
            name: profile.name,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            image: profile.picture ?? profile.image ?? profile.image_url,
          },
        });
      }

      return true;
    },

    session: ({ session, ...others }) => {
      if ("token" in others) {
        session.user.id = others.token.sub!;
        session.user.name = others.token.name;
        session.user.email = others.token.email!;
        session.user.image = others.token.picture;
      }

      return session;
    },

    jwt: async ({ token, user }) => {
      if (!token.email) {
        throw new Error("Unable to sign in with this email address");
      }

      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      });

      if (!dbUser) {
        if (user) {
          token.sub = user.id;
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
