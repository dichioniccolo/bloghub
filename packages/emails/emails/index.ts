import { render } from "@react-email/render";
import nodemailer, { type SendMailOptions } from "nodemailer";

import { type emailNotificationSettingTypeEnum } from "@acme/db";

import { env } from "../env.mjs";
import {
  createEmailSettingsMap,
  fetchEmailNotificationSettings,
  filterEmailsBySettings,
} from "./utils";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

type MailOptions = Omit<SendMailOptions, "html" | "text"> & {
  component: JSX.Element;
  type: (typeof emailNotificationSettingTypeEnum.enumValues)[number];
};

const defaultOptions = {
  from: env.SMTP_FROM,
} satisfies SendMailOptions;

function buildSendMail(
  transporter: ReturnType<typeof nodemailer.createTransport>,
) {
  return async ({ component, to, type, ...rest }: MailOptions) => {
    if (!to) {
      return null;
    }

    const toEmails = Array.isArray(to) ? to : [to];
    const emails = toEmails.map((email) =>
      typeof email === "string" ? { name: "", address: email } : email,
    );

    const emailAddresses = emails.map((email) => email.address);

    const usersSettings = await fetchEmailNotificationSettings(
      type,
      emailAddresses,
    );

    const emailSettingsMap = createEmailSettingsMap(usersSettings);

    const toFinal = filterEmailsBySettings(emails, emailSettingsMap);

    if (toFinal.length === 0) {
      return null;
    }

    try {
      const result = await transporter.sendMail({
        ...defaultOptions,
        ...rest,
        headers: {
          ...rest.headers,
          // Set this to prevent Gmail from threading emails.
          // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
          "X-Entity-Ref-ID": `${new Date().getTime()}`,
        },
        to: toFinal.map((email) => email.address),
        html: render(component, { pretty: false }),
        text: render(component, { plainText: true }),
      });
      return result;
    } catch (error) {
      // Handle error appropriately
      console.error("Failed to send email:", error);
      throw error;
    }
  };
}

export const sendMail = buildSendMail(transporter);
