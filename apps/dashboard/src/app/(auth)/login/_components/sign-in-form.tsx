"use client";

import type { HTMLAttributes } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { cn } from "@acme/ui";
import { Alert, AlertDescription, AlertTitle } from "@acme/ui/components/alert";
import { Button } from "@acme/ui/components/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/components/form";
import { Input } from "@acme/ui/components/input";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import type { UserAuthSchemaType } from "~/lib/validation/schema";
import { UserAuthSchema } from "~/lib/validation/schema";

type Props = HTMLAttributes<HTMLDivElement>;

export function SignInForm({ className, ...props }: Props) {
  const searchParams = useSearchParams();

  const error = searchParams?.get("error");

  const isVerificationError = error === "Verification";

  const onSubmit = async ({ email }: UserAuthSchemaType) => {
    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: searchParams?.get("from") ?? "/",
    });

    if (!result?.ok) {
      return toast.error("Your sign in request failed, please try again");
    }

    toast.success("We sent you a login link. Be sure to check your spam too");
  };

  const form = useZodForm({
    schema: UserAuthSchema,
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {isVerificationError && (
        <Alert variant="destructive">
          <AlertTitle>Unable to sign in</AlertTitle>
          <AlertDescription>
            The sign in link is no longer valid. It may have been used already
            or it may have expired.
          </AlertDescription>
        </Alert>
      )}
      <Form form={form} onSubmit={onSubmit}>
        <div className="grid gap-2">
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-slate-600">Or</span>
        </div>
      </div>
      <Button
        className="flex w-full items-center justify-center space-x-2 bg-[#7289DA] text-white hover:bg-[#7289DA]/90"
        variant="default"
        onClick={async () => {
          await signIn("discord", {
            redirect: false,
            callbackUrl: searchParams?.get("from") ?? "/",
          });
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          width="24"
          height="24"
          preserveAspectRatio="xMidYMid"
          viewBox="0 -28.5 256 256"
        >
          <path
            fill="#5865F2"
            d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
          />
        </svg>
        <span>Sign In with Discord</span>
      </Button>
    </div>
  );
}
