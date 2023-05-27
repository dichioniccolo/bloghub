"use client";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { updateUser } from "~/lib/shared/actions/update-user-name";
import {
  UserNameSchema,
  type UserNameSchemaType,
} from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";

export function ProfileForm() {
  const user = useUser();

  const { mutate } = useZact(updateUser);

  async function onSubmit({ name }: UserNameSchemaType) {
    await mutate({
      userId: user.id,
      name,
    });
  }

  return (
    <Card className="border-none shadow-none">
      {/* <CardHeader className="px-0">
        <CardTitle>Your Name</CardTitle>
        <CardDescription>
          Please enter your full name or a display name you are comfortable
          with.
        </CardDescription>
      </CardHeader> */}
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
