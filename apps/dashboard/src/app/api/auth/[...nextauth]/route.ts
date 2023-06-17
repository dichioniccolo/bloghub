import { get, has } from "@vercel/edge-config";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { authOptions, getLoginUrl } from "@acme/auth";
import { AppRoutes } from "@acme/common/routes";
import { db, eq, users } from "@acme/db";
import { LoginLink, sendMail, WelcomeEmail } from "@acme/emails";

import { env } from "~/env.mjs";

const handler = NextAuth({
  ...authOptions,
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        if (!(await has("emailWhitelist"))) {
          return;
        }

        const whitelist = await get("emailWhitelist");

        if (!Array.isArray(whitelist)) {
          return;
        }

        if (!whitelist.includes(identifier)) {
          return;
        }

        const user = await db
          .select({
            name: users.name,
          })
          .from(users)
          .where(eq(users.email, identifier))
          .then((x) => x[0]);

        await sendMail({
          type: "security",
          to: identifier,
          subject: "Your login link",
          component: LoginLink({
            siteName: env.NEXT_PUBLIC_APP_NAME,
            url,
            userName: user?.name,
            userEmail: identifier,
          }),
        });
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
  events: {
    async createUser({ user }) {
      if (!user.email) {
        return;
      }

      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const unsubscribeUrl = await getLoginUrl(
        user.email,
        expiresAt,
        `${env.NEXT_PUBLIC_APP_URL}${AppRoutes.NotificationsSettings}`,
      );

      await sendMail({
        type: "communication",
        to: user.email,
        subject: `Welcome to ${env.NEXT_PUBLIC_APP_NAME}`,
        component: WelcomeEmail({
          siteName: env.NEXT_PUBLIC_APP_NAME,
          userEmail: user.email,
          unsubscribeUrl,
        }),
      });
    },
  },
});

export { handler as GET, handler as POST };
