"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { AppRoutes } from "~/lib/common/routes";

export function useUser() {
  const router = useRouter();

  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace(AppRoutes.Login);
    },
  });

  if (!data) {
    void signOut();
  }

  return data?.user ?? null;
}
