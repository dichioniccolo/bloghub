"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export function useUser() {
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (!data?.user) {
    throw new Error("You must be authenticated");
  }

  return data.user;
}
