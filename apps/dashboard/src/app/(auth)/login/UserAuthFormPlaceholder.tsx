"use client";

import { Form, Input, Label, buttonVariants } from "@acme/ui";

import { Icons } from "~/components/icons";
import { cn } from "~/lib/utils";
import { UserAuthSchema } from "~/lib/validation/schema";

export function UserAuthFormPlaceholder() {
  return (
    <div className={cn("grid gap-6")}>
      <Form
        schema={UserAuthSchema}
        onSubmit={() => {
          //
        }}
      >
        {({ register, formState: { isSubmitting, errors } }) => (
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                disabled
                id="email"
                type="email"
                placeholder="you@example.com"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                {...register("email")}
              />
              {errors?.email && (
                <p className="px-1 text-xs text-red-600">
                  {errors.email.message?.toString()}
                </p>
              )}
            </div>
            <button disabled className={cn(buttonVariants())}>
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In with Email
            </button>
          </div>
        )}
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-600">Or continue with</span>
        </div>
      </div>
      <>TODO: Add social login buttons</>
    </div>
  );
}
