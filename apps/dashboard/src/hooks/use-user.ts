"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { AppRoutes } from "@acme/common/routes";

export function useUser() {
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(AppRoutes.Login);
    },
  });

  if (!data?.user) {
    throw new Error("You must be authenticated");
  }

  return data.user;
}
