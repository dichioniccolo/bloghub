import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { Client } from "postmark";

import { authOptions } from "@acme/auth";
import { WelcomeEmail, sendMarketingMail } from "@acme/emails";

import { env } from "~/env.mjs";

// Send an email:
const client = new Client(env.POSTMARK_API_KEY);

export default NextAuth({
  ...authOptions,
  providers: [
    EmailProvider({
      from: env.POSTMARK_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        if (identifier !== "dichioniccolo@gmail.com") {
          return;
        }

        const result = await client.sendEmailWithTemplate({
          TemplateId: env.POSTMARK_LOGIN_LINK_TEMPLATE_ID,
          To: identifier,
          From: provider.from ?? env.POSTMARK_FROM,
          TemplateModel: {
            url,
          },
          Headers: [
            {
              // Set this to prevent Gmail from threading emails.
              // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
              Name: "X-Entity-Ref-ID",
              Value: `${new Date().getTime()}`,
            },
          ],
        });

        if (result.ErrorCode) {
          throw new Error(result.Message);
        }

        // await sendMail({
        //   to: identifier,
        //   subject: "Your login link",
        //   component: <LoginLink url={url} />,
        //   headers: {
        //     // Set this to prevent Gmail from threading emails.
        //     // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
        //     "X-Entity-Ref-ID": `${new Date().getTime()}`,
        //   },
        // });
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
        component: <WelcomeEmail email={user.email} />,
      });
    },
  },
});
