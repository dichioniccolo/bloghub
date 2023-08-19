import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { db, EmailNotificationSetting, eq, genId, users } from "@acme/db";
import { LoginLink, sendMail, WelcomeEmail } from "@acme/emails";

import { env } from "~/env.mjs";
import { authOptions, getLoginUrl } from "~/lib/auth";
import { AppRoutes } from "~/lib/common/routes";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth({
  ...authOptions,
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        const user = await db
          .select({
            name: users.name,
          })
          .from(users)
          .where(eq(users.email, identifier))
          .then((x) => x[0]);

        await sendMail({
          type: EmailNotificationSetting.Security,
          to: identifier,
          subject: "Your login link",
          component: LoginLink({
            siteName: env.NEXT_PUBLIC_APP_NAME,
            url,
            userName: user?.name,
            userEmail: identifier,
          }),
          headers: {
            "X-Entity-Ref-ID": genId(),
          },
        });
      },
    }),
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
        `${
          env.NODE_ENV === "development"
            ? `http://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
            : `https://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
        }${AppRoutes.NotificationsSettings}`,
      );

      await sendMail({
        type: EmailNotificationSetting.Communication,
        to: user.email,
        subject: `Welcome to ${env.NEXT_PUBLIC_APP_NAME}`,
        component: WelcomeEmail({
          siteName: env.NEXT_PUBLIC_APP_NAME,
          userEmail: user.email,
          unsubscribeUrl,
        }),
        headers: {
          "List-Unsubscribe": unsubscribeUrl,
        },
      });
    },
  },
});

export { handler as GET, handler as POST };
