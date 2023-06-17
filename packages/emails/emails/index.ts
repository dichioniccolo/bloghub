import { type ReactElement } from "react";
import { Resend } from "resend";
import { type CreateEmailOptions } from "resend/build/src/emails/interfaces";

import { type emailNotificationSettingTypeEnum } from "@acme/db";

import { env } from "../env.mjs";
import {
  createEmailSettingsMap,
  fetchEmailNotificationSettings,
  filterEmailsBySettings,
} from "./utils";

type MailOptions = Omit<CreateEmailOptions, "html" | "text"> & {
  component: ReactElement;
  type: (typeof emailNotificationSettingTypeEnum.enumValues)[number];
};

const defaultOptions = {
  from: env.SMTP_FROM,
} satisfies Partial<CreateEmailOptions>;

function buildSendMail() {
  // const transporter = nodemailer.createTransport({
  //   host: env.SMTP_HOST,
  //   port: env.SMTP_PORT,
  //   auth: {
  //     user: env.SMTP_USER,
  //     pass: env.SMTP_PASSWORD,
  //   },
  // });

  const resend = new Resend(env.RESEND_API_KEY);

  return async ({ component, to, type, ...rest }: MailOptions) => {
    if (!to) {
      return null;
    }

    const toEmails = Array.isArray(to) ? to : [to];

    const usersSettings = await fetchEmailNotificationSettings(type, toEmails);

    const emailSettingsMap = createEmailSettingsMap(usersSettings);

    const toFinal = filterEmailsBySettings(toEmails, emailSettingsMap);

    if (toFinal.length === 0) {
      return null;
    }

    try {
      const result = await resend.emails.send({
        ...defaultOptions,
        ...rest,
        to: toFinal,
        react: component,
      });
      return result;
    } catch (error) {
      // Handle error appropriately
      console.error("Failed to send email:", error);
      throw error;
    }
  };
}

export const sendMail = buildSendMail();
