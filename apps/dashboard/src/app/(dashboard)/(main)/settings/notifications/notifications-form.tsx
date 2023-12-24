"use client";

import { Loader2 } from "lucide-react";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@acme/ui/components/ui/form";
import { Switch } from "@acme/ui/components/ui/switch";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { updateNotificationSettings } from "~/app/_actions/user/update-notifications-settings";
import { SubmitButton } from "~/components/submit-button";
import type { EditNotificationsSchemaType } from "~/lib/validation/schema";
import { EditNotificationsSchema } from "~/lib/validation/schema";

interface Props {
  settings: EditNotificationsSchemaType;
}

export function NotificationsForm({ settings }: Props) {
  const { action, status } = useServerAction(updateNotificationSettings);

  const onSubmit = ({
    communication,
    marketing,
    social,
    security,
  }: EditNotificationsSchemaType) =>
    action({
      communication,
      marketing,
      social,
      security,
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
              name="communication"
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
              name="marketing"
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
              name="social"
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
              name="security"
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
          <SubmitButton disabled={status === SubmissionStatus.PENDING}>
            {status === SubmissionStatus.PENDING && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </SubmitButton>
        </CardFooter>
      </Card>
    </Form>
  );
}
