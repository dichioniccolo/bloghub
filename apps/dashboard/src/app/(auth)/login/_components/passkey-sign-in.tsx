"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/webauthn";
import { toast } from "sonner";

import { Button } from "@acme/ui/components/ui/button";

export function PasskeySignIn() {
  const searchParams = useSearchParams();

  return (
    <div className="flex w-full gap-2">
      <Button
        className="w-full"
        onClick={async () => {
          try {
            await signIn("passkey", {
              action: "register",
            });
          } catch {
            toast.error("An error occurred while signing in with passkey");
          }
        }}
      >
        Register a new passkey
      </Button>
      <Button
        className="w-full"
        onClick={async () => {
          try {
            await signIn("passkey", {
              redirect: false,
              callbackUrl: searchParams.get("from") ?? "/",
            });
          } catch {
            toast.error("An error occurred while signing in with passkey");
          }
        }}
      >
        Sign in with passkey
      </Button>
    </div>
  );
}
