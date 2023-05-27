import { createHash, randomBytes } from "crypto";

import { prisma } from "@acme/db";

import { env } from "../env.mjs";

export async function getLoginUrl(
  identifier: string,
  expires: Date,
  callbackUrl: string,
) {
  const token = randomBytes(32).toString("hex");

  await prisma.verificationToken.create({
    data: {
      identifier,
      expires,
      token: createHash("sha256")
        .update(`${token}${env.NEXTAUTH_SECRET}`)
        .digest("hex"),
    },
  });

  const params = new URLSearchParams({
    callbackUrl,
    email: identifier,
    token,
  });

  const url = `${
    env.NEXT_PUBLIC_APP_URL
  }/api/auth/callback/email?${params.toString()}`;

  return url;
}
