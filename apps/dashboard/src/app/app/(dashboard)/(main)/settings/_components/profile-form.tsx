"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Form } from "~/components/ui/zod-form";
import { updateUser } from "~/app/_actions/user/update-user";
import { useUser } from "~/hooks/use-user";
import type { UserNameSchemaType } from "~/lib/validation/schema";
import { UserNameSchema } from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";

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
          name: user?.name ?? "",
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
