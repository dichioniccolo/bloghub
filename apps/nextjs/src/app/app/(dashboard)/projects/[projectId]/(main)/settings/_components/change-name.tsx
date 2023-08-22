"use client";

import { Loader2 } from "lucide-react";

import { updateProjectName } from "~/app/_actions/project/update-project-name";
import type { GetProject } from "~/app/_api/projects";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Form } from "~/components/ui/zod-form";
import { useZodForm } from "~/hooks/use-zod-form";
import type { ProjectNameSchemaType } from "~/lib/validation/schema";
import { ProjectNameSchema } from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";

interface Props {
  project: NonNullable<GetProject>;
}

export function ChangeName({ project }: Props) {
  const { mutate } = useZact(updateProjectName);

  const onSubmit = ({ name }: ProjectNameSchemaType) =>
    mutate({
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
              form.formState.isSubmitting || form.watch("name") === project.name
            }
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
}
