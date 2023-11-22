"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
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
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { updateProjectName } from "~/app/_actions/project/update-project-name";
import type { GetProject } from "~/app/_api/projects";
import type { ProjectNameSchemaType } from "~/lib/validation/schema";
import { ProjectNameSchema } from "~/lib/validation/schema";

interface Props {
  project: NonNullable<GetProject>;
}

export function ChangeName({ project }: Props) {
  const { action, status } = useServerAction(updateProjectName, {
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onSubmit = ({ name }: ProjectNameSchemaType) =>
    action({
      projectId: project.id,
      name,
    });

  const form = useZodForm({
    schema: ProjectNameSchema,
    defaultValues: {
      name: project.name,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Name</CardTitle>
        <CardDescription>This is the name of your project.</CardDescription>
      </CardHeader>
      <Form form={form} onSubmit={onSubmit}>
        <CardContent>
          <FormField<ProjectNameSchemaType>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button
            disabled={
              status === SubmissionStatus.PENDING ||
              form.watch("name") === project.name
            }
          >
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
