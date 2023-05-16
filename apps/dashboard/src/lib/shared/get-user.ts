"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";

export async function $getUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be authenticated");
  }

  return session.user;
}
