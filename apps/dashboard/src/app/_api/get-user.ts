"use server";

import { cache } from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "~/lib/auth";

export const $getUser = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    notFound();
  }

  return session.user;
});
