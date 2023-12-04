import { createId, db, eq, schema } from "@acme/db";
import { LoginLink } from "@acme/emails";
import { inngest } from "@acme/inngest";

import { env } from "~/env.mjs";
import { sendMail } from "~/lib/email";

export const userLoginLink = inngest.createFunction(
  {
    id: "user/login-link",
    name: "User Login Link",
  },
  {
    event: "user/login-link",
  },
  async ({ event }) => {
    const { email, url } = event.data;

    const user = await db.query.user.findFirst({
      where: eq(schema.user.email, email),
      columns: {
        name: true,
      },
    });

    await sendMail({
      type: "SECURITY",
      to: email,
      subject: "Your login link",
      react: LoginLink({
        siteName: env.NEXT_PUBLIC_APP_NAME,
        url,
        userName: user?.name,
        userEmail: email,
      }),
      headers: {
        "X-Entity-Ref-ID": createId(),
      },
    });
  },
);
