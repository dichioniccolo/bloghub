"use client";

import { useSession } from "next-auth/react";

import { Button } from "@acme/ui/components/button";
import { Card, CardContent, CardFooter } from "@acme/ui/components/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/components/form";
import { Input } from "@acme/ui/components/input";
import { Form } from "@acme/ui/components/zod-form";
import { useZact } from "@acme/zact/client";

import { updateUser } from "~/app/_actions/user/update-user";
import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import {
  UserNameSchema,
  type UserNameSchemaType,
} from "~/lib/validation/schema";

export function ProfileForm() {
  const user = useUser();
  const { update } = useSession();

  const { mutate } = useZact(updateUser);

  async function onSubmit({ name }: UserNameSchemaType) {
    await mutate({
      name,
    });
    await update({
      name,
    });
  }

  return (
    <Card className="border-none shadow-none">
      <Form
        onSubmit={onSubmit}
        schema={UserNameSchema}
        initialValues={{
          name: user.name ?? "",
        }}
      >
        {({ formState: { isSubmitting } }) => (
          <>
            <CardContent className="px-0">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-0.5">
                      <FormLabel>Name</FormLabel>
                      <FormDescription>
                        This is the name that will be displayed on your profile.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Input
                        className="w-[400px]"
                        size={32}
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="px-0">
              <Button disabled={isSubmitting}>
                {isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                <span>Save</span>
              </Button>
            </CardFooter>
          </>
        )}
      </Form>
    </Card>
  );
}
