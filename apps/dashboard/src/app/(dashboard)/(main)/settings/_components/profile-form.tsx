"use client";

import { Loader2 } from "lucide-react";

import type { Session } from "@acme/auth";
import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/ui/button";
import { Card, CardContent, CardFooter } from "@acme/ui/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/components/ui/form";
import { Input } from "@acme/ui/components/ui/input";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { updateUser } from "~/app/_actions/user/update-user";
import type { UserNameSchemaType } from "~/lib/validation/schema";
import { UserNameSchema } from "~/lib/validation/schema";

interface Props {
  session: Session;
}

export function ProfileForm({ session }: Props) {
  const { action, status, validationErrors } = useServerAction(updateUser);

  const onSubmit = ({ name }: UserNameSchemaType) =>
    action({
      name,
    });

  const form = useZodForm({
    schema: UserNameSchema,
    defaultValues: {
      name: session.user.name ?? "",
    },
  });

  return (
    <Card className="border-none shadow-none">
      <Form form={form} onSubmit={onSubmit}>
        <CardContent className="px-0">
          <FormField<UserNameSchemaType>
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
                  <Input className="w-[400px]" size={32} {...field} />
                </FormControl>
                <FormMessage>{validationErrors?.name?.[0]}</FormMessage>
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="px-0">
          <Button disabled={status === SubmissionStatus.PENDING}>
            {status === SubmissionStatus.PENDING && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
}
