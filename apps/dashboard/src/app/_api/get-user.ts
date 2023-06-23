"use server";

import { getServerSession } from "next-auth";
import { cache } from "react";

import { authOptions } from "@acme/auth";
import { notFound } from "next/navigation";

export const $getUser = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    notFound();
  }

  return session.user;
});
