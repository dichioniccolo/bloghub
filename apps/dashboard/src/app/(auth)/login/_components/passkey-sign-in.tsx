"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/webauthn";
import { toast } from "sonner";

import { Button } from "@acme/ui/components/ui/button";

export function PasskeySignIn() {
  const searchParams = useSearchParams();

  const onClick = useCallback(async () => {
    try {
      await signIn("passkey", {
        redirect: false,
        callbackUrl: searchParams.get("from") ?? "/",
      });
    } catch {
      toast.error("An error occurred while signing in with passkey");
    }
  }, [searchParams]);

  return <Button onClick={onClick}>Sign in with passkey</Button>;
}
