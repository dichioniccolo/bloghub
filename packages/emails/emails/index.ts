import { render } from "@react-email/render";
import nodemailer, { type SendMailOptions } from "nodemailer";

import { env } from "../env.mjs";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

const markeringTransporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

type MailOptions = Omit<SendMailOptions, "html" | "text"> & {
  component: JSX.Element;
};

const defaultOptions = {
  from: env.SMTP_FROM,
} satisfies SendMailOptions;

function buildSendMail(
  transporter: ReturnType<typeof nodemailer.createTransport>,
) {
  return (options: MailOptions) => {
    const { component, ...rest } = options;

    return transporter.sendMail({
      ...defaultOptions,
      ...rest,
      html: render(component, {
        pretty: false,
      }),
      text: render(component, {
        plainText: true,
      }),
    });
  };
}

export const sendMail = buildSendMail(transporter);

export const sendMarketingMail = buildSendMail(markeringTransporter);
