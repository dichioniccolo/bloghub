"use client";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Switch,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { updateNotificationSettings } from "~/lib/shared/actions/update-notifications-settings";
import {
  EditNotificationsSchema,
  type EditNotificationsSchemaType,
} from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";

type Props = {
  settings: EditNotificationsSchemaType;
};

export function NotificationsForm({ settings }: Props) {
  const user = useUser();
  const { mutate } = useZact(updateNotificationSettings);

  async function onSubmit({
    communication_emails,
    marketing_emails,
    social_emails,
  }: EditNotificationsSchemaType) {
    await mutate({
      userId: user.id,
      communication_emails,
      marketing_emails,
      social_emails,
    });
  }

  return (
    <Form
      schema={EditNotificationsSchema}
      onSubmit={onSubmit}
      initialValues={settings}
      className="space-y-8"
    >
      {({ formState: { isSubmitting } }) => (
        <Card className="border-none shadow-none">
          <CardHeader className="px-0">
            <CardTitle>Email Notifications</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-4">
              <FormField<EditNotificationsSchemaType>
                name="communication_emails"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Communication emails
                      </FormLabel>
                      <FormDescription>
                        Receive emails about your account activity.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField<EditNotificationsSchemaType>
                name="marketing_emails"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Marketing emails
                      </FormLabel>
                      <FormDescription>
                        Receive emails about new features, and more.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField<EditNotificationsSchemaType>
                name="social_emails"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Social emails</FormLabel>
                      <FormDescription>
                        Receive emails for project invitations, and more.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="px-0">
            <Button disabled={isSubmitting}>
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>Save</span>
            </Button>
          </CardFooter>
        </Card>
      )}
    </Form>
  );
}
