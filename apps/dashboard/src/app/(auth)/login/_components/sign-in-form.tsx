"use client";

import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

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

export function SignInForm() {
  const searchParams = useSearchParams();

  const error = searchParams?.get("error");

  const isVerificationError = error === "Verification";

  const onSubmit = async ({ email }: UserAuthSchemaType) => {
    await signIn("email", {
      email,
      redirect: false,
      callbackUrl: searchParams?.get("from") ?? "/",
    });

    toast.success("We sent you a login link. Be sure to check your spam too");
  };

  const form = useZodForm({
    schema: UserAuthSchema,
    defaultValues: {
      email: "",
    },
  });

  return (
    <>
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
          <FormField<UserAuthSchemaType>
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
    </>
  );
}
