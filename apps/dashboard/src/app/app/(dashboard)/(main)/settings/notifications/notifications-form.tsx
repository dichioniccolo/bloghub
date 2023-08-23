"use client";

import { Loader2 } from "lucide-react";

import { updateNotificationSettings } from "~/app/_actions/user/update-notifications-settings";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Switch } from "~/components/ui/switch";
import { Form } from "~/components/ui/zod-form";
import { useZodForm } from "~/hooks/use-zod-form";
import type { EditNotificationsSchemaType } from "~/lib/validation/schema";
import { EditNotificationsSchema } from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";

interface Props {
  settings: EditNotificationsSchemaType;
}

export function NotificationsForm({ settings }: Props) {
  const { mutate } = useZact(updateNotificationSettings);

  const onSubmit = ({
    communication_emails,
    marketing_emails,
    social_emails,
    security_emails,
  }: EditNotificationsSchemaType) =>
    mutate({
      communication_emails,
      marketing_emails,
      social_emails,
      security_emails,
    });

  const form = useZodForm({
    schema: EditNotificationsSchema,
    defaultValues: settings,
  });

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-8">
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
            <FormField<EditNotificationsSchemaType>
              name="security_emails"
              render={() => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Security emails</FormLabel>
                    <FormDescription>
                      Receive emails about your account activity and security
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch disabled />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="px-0">
          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
