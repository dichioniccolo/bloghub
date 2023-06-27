"use client";

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
import { Icons } from "~/app/_components/icons";
import { UserAuthSchema } from "~/lib/validation/schema";

export function UserAuthFormPlaceholder() {
  return (
    <div className="grid gap-6">
      <Form
        schema={UserAuthSchema}
        onSubmit={() => {
          //
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
            <Button disabled>
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
