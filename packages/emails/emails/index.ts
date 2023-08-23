import { Resend } from "resend";
import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";

import { env } from "../env.mjs";

const defaultOptions = {
  from: env.SMTP_FROM,
} satisfies Pick<CreateEmailOptions, "from">;

export async function sendMail({
  ...options
}: Partial<CreateEmailOptionsWithoutFrom>) {
  const resend = new Resend(env.RESEND_API_KEY);

  const payload = {
    ...defaultOptions,
    ...options,
  } as CreateEmailOptions;

  const result = await resend.emails.send(payload);

  return result;
}

type CreateEmailOptionsWithoutFrom = Omit<CreateEmailOptions, "from">;

export type { CreateEmailOptionsWithoutFrom as CreateEmailOptions };
