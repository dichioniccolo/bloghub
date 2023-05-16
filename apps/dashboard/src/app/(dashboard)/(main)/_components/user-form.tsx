"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  Input,
  Label,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { updateUser } from "~/lib/shared/actions/update-user-name";
import {
  UserNameSchema,
  type UserNameSchemaType,
} from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";

export function UserNameForm() {
  const user = useUser();

  const { mutate } = useZact(updateUser);

  async function onSubmit({ name }: UserNameSchemaType) {
    await mutate({
      userId: user.id,
      name,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Name</CardTitle>
        <CardDescription>
          Please enter your full name or a display name you are comfortable
          with.
        </CardDescription>
      </CardHeader>
      <Form
        onSubmit={onSubmit}
        schema={UserNameSchema}
        initialValues={{
          name: user.name ?? "",
        }}
      >
        {({ register, formState: { errors, isSubmitting } }) => (
          <>
            <CardContent>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  className="w-[400px]"
                  size={32}
                  defaultValue={user.name ?? ""}
                  {...register("name")}
                />
                {errors?.name && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
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
