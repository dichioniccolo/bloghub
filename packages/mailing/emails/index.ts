import { buildSendMail } from "mailing-core";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  pool: true,
  host: "smtp.postmarkapp.com",
  port: 587,
  // secure: true, // use TLS
  auth: {
    user: process.env.POSTMARK_API_KEY,
    pass: process.env.POSTMARK_API_KEY,
  },
});

const broadcast = nodemailer.createTransport({
  pool: true,
  host: "smtp-broadcasts.postmarkapp.com",
  port: 587,
  auth: {
    accessToken: process.env.POSTMARK_BROADCAST_ACCESS_KEY,
    clientSecret: process.env.POSTMARK_BROADCAST_SECRET_KEY,
  },
});

const sendMail = buildSendMail({
  transport,
  defaultFrom: process.env.POSTMARK_FROM as string,
  configPath: "./mailing.config.json",
});

export { default as LoginLink } from "./LoginLink";
export { default as ProjectInvite } from "./ProjectInvite";
export { default as Welcome } from "./Welcome";

export const sendMailBroadcast = buildSendMail({
  transport: broadcast,
  defaultFrom: process.env.POSTMARK_FROM as string,
  configPath: "./mailing.config.json",
});

export default sendMail;
