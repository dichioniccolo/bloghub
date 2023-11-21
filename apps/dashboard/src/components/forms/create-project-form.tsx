import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { Project } from "@acme/db";
import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/button";
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

import { createProject } from "~/app/_actions/project/create-project";
import { env } from "~/env.mjs";
import type { CreateProjectSchemaType } from "~/lib/validation/schema";
import { CreateProjectSchema } from "~/lib/validation/schema";

interface Props {
  onSuccess?(project: Project): void;
}

export function CreateProjectForm({ onSuccess }: Props) {
  const { action, status, validationErrors } = useServerAction(createProject, {
    onSuccess(data) {
      toast.success("Project created");
      onSuccess?.(data);
    },
  });

  const onSubmit = ({ name, domain }: CreateProjectSchemaType) =>
    action({
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
      <FormField<CreateProjectSchemaType>
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
            <FormMessage>{validationErrors.name?.[0]}</FormMessage>
          </FormItem>
        )}
      />

      <FormField<CreateProjectSchemaType>
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
            <FormMessage>{validationErrors.domain?.[0]}</FormMessage>
            <FormDescription>
              TIP: If you do not have a custom domain, you can use a .
              {env.NEXT_PUBLIC_APP_DOMAIN} subdomain as long as it is available.
            </FormDescription>
          </FormItem>
        )}
      />
      <Button disabled={status === SubmissionStatus.PENDING}>
        {status === SubmissionStatus.PENDING && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Create project
      </Button>
    </Form>
  );
}
