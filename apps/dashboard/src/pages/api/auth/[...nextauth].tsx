import sendMail, { sendMarketingMail } from "emails";
import LoginLink from "emails/LoginLink";
import Welcome from "emails/Welcome";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { authOptions } from "@acme/auth";

import { env } from "~/env.mjs";

export default NextAuth({
  ...authOptions,
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        if (identifier !== "dichioniccolo@gmail.com") {
          return;
        }

        const r = await sendMail({
          to: identifier,
          subject: `Your login link`,
          component: <LoginLink url={url} />,
          headers: {
            // Set this to prevent Gmail from threading emails.
            // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
            "X-Entity-Ref-ID": `${new Date().getTime()}`,
          },
        });

        throw r;
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

      await sendMarketingMail({
        to: user.email,
        subject: `Welcome to ${env.NEXT_PUBLIC_APP_NAME}`,
        component: <Welcome email={user.email} />,
      });
    },
  },
});
