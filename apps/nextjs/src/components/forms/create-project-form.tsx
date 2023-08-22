import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { Project } from "@acme/db";

import { createProject } from "~/app/_actions/project/create-project";
import { env } from "~/env.mjs";
import { useZodForm } from "~/hooks/use-zod-form";
import type { CreateProjectSchemaType } from "~/lib/validation/schema";
import { CreateProjectSchema } from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";
import { Button } from "../ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Form } from "../ui/zod-form";

interface Props {
  onSuccess?(project: Project): void;
}

export function CreateProjectForm({ onSuccess }: Props) {
  const { mutate } = useZact(createProject, {
    onSuccess: (data) => {
      toast.success("Project created");
      onSuccess?.(data);
    },
  });

  const onSubmit = ({ name, domain }: CreateProjectSchemaType) =>
    mutate({
      name,
      domain,
    });

  const form = useZodForm({
    schema: CreateProjectSchema,
    defaultValues: {
      name: "",
      domain: "",
    },
  });

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col space-y-6 text-left"
    >
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input
                placeholder="My project name"
                autoComplete="project-name"
                autoCorrect="off"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="domain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Domain</FormLabel>
            <FormControl>
              <Input
                placeholder="blog.me.com"
                autoComplete="domain"
                autoCorrect="off"
                {...field}
              />
            </FormControl>
            <FormMessage />
            <FormDescription>
              TIP: If you do not have a custom domain, you can use a .
              {env.NEXT_PUBLIC_APP_DOMAIN} subdomain as long as it is available.
            </FormDescription>
          </FormItem>
        )}
      />
      <Button disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Create project
      </Button>
    </Form>
  );
}
