"use client";

import type { HTMLAttributes } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Form } from "~/components/ui/zod-form";
import { cn } from "~/lib/cn";
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
      <Form
        schema={UserAuthSchema}
        onSubmit={onSubmit}
        initialValues={{
          email: "",
        }}
      >
        {({ formState: { isSubmitting } }) => (
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
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In with Email
            </Button>
          </div>
        )}
      </Form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-slate-600">Or continue with</span>
        </div>
      </div>
      <>TODO: Add social login buttons</> */}
    </div>
  );
}
