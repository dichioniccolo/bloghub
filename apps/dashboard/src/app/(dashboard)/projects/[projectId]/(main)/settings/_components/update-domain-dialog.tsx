"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/components/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/components/form";
import { Input } from "@acme/ui/components/input";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { updateDomain } from "~/app/_actions/project/update-domain";
import type { GetProject } from "~/app/_api/projects";
import type { UpdateDomainSchemaType } from "~/lib/validation/schema";
import { UpdateDomainSchema } from "~/lib/validation/schema";

interface Props {
  project: NonNullable<GetProject>;
}

export function UpdateDomainDialog({ project }: Props) {
  const [open, setOpen] = useState(false);

  const { action, status } = useServerAction(updateDomain, {
    onSuccess: () => {
      setOpen(false);

      toast.success("Domain updated");
    },
    onServerError: (error) => {
      error && toast.error(error);
    },
  });

  const onSubmit = ({
    oldDomain,
    newDomain,
    confirm,
  }: UpdateDomainSchemaType) =>
    action({
      projectId: project.id,
      oldDomain,
      newDomain,
      confirm,
    });

  const form = useZodForm({
    schema: UpdateDomainSchema,
    defaultValues: {
      oldDomain: project.domain,
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Change</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Change Domain</DialogTitle>
        <Form
          form={form}
          onSubmit={onSubmit}
          className="flex flex-col space-y-6 text-left"
        >
          <FormField<UpdateDomainSchemaType>
            name="oldDomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old domain</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    tabIndex={-1}
                    autoComplete="off"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<UpdateDomainSchemaType>
            name="newDomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New domain</FormLabel>
                <FormControl>
                  <Input autoComplete="off" autoCorrect="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<UpdateDomainSchemaType>
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  To verify, type{" "}
                  <Badge variant="secondary">yes, change my domain</Badge>
                </FormLabel>
                <FormControl>
                  <Input autoComplete="off" autoCorrect="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={status === SubmissionStatus.PENDING}
            variant="destructive"
          >
            {status === SubmissionStatus.PENDING && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm domain change
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
