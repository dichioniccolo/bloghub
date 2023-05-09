"use client";

import { useSession } from "next-auth/react";

export function useUser() {
  const { data } = useSession();

  if (!data?.user) {
    throw new Error("You must be authenticated");
  }

  return data.user;
}
