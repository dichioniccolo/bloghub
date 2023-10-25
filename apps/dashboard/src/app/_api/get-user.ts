"use server";

import { cache } from "react";
import { notFound } from "next/navigation";

import { auth } from "@acme/auth";

export const $getUser = cache(async () => {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  return session.user;
});
