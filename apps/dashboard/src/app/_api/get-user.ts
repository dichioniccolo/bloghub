"use server";

import { cache } from "react";
import { notFound } from "next/navigation";
import { authOptions } from "@bloghub/auth";
import { getServerSession } from "next-auth";

export const $getUser = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    notFound();
  }

  return session.user;
});
