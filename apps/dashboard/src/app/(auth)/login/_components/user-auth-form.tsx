"use client";

import { type HTMLAttributes } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { cn } from "~/lib/utils";
import {
  UserAuthSchema,
  type UserAuthSchemaType,
} from "~/lib/validation/schema";

type Props = HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: Props) {
  const { toast } = useToast();

  const searchParams = useSearchParams();

  const error = searchParams?.get("error");

  const isVerificationError = error === "Verification";

  async function onSubmit({ email }: UserAuthSchemaType) {
    const signInResult = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: searchParams?.get("from") || "/",
    });

    if (!signInResult?.ok) {
      toast({
        title: "Something went wrong",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    }

    toast({
      title: "Check your email",
      description: "We sent you a login link. Be sure to check your spam too",
    });
  }

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
      <Form schema={UserAuthSchema} onSubmit={onSubmit}>
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
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
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
