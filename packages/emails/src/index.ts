import { buildSendMail } from "mailing-core";
import nodemailer from "nodemailer";

import { env } from "../env.mjs";

const sendMail = buildSendMail({
  transport: nodemailer.createTransport({
    host: "smtp.postmarkapp.com",
    port: 587,
    auth: {
      user: env.POSTMARK_API_KEY,
      pass: env.POSTMARK_API_KEY,
    },
  }),
  defaultFrom: env.POSTMARK_FROM,
  configPath: "./mailing.config.json",
});

export default sendMail;

export const sendMarketingMail = buildSendMail({
  transport: nodemailer.createTransport({
    host: "smtp-broadcasts.postmarkapp.com",
    port: 587,
    auth: {
      user: env.POSTMARK_API_KEY,
      pass: env.POSTMARK_API_KEY,
    },
  }),
  defaultFrom: env.POSTMARK_FROM,
  configPath: "./mailing.config.json",
});
