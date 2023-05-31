"use server";

import { cache } from "react";
import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";

export const $getUser = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be authenticated");
  }

  return session.user;
});
