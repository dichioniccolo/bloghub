"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Form } from "@acme/ui/zod-form";
import { useZact } from "@acme/zact/client";

import { updateDomain } from "~/app/_actions/project/update-domain";
import { type GetProject } from "~/app/_api/projects";
import { Icons } from "~/app/_components/icons";
import {
  UpdateDomainSchema,
  type UpdateDomainSchemaType,
} from "~/lib/validation/schema";

type Props = {
  project: NonNullable<GetProject>;
};

export function UpdateDomainDialog({ project }: Props) {
  const [open, setOpen] = useState(false);

  const { mutate } = useZact(updateDomain, {
    onSuccess: () => {
      setOpen(false);

      toast.success("Domain updated");
    },
    onServerError: () => {
      toast.error("Something went wrong");
    },
  });

  const onSubmit = ({ newDomain }: UpdateDomainSchemaType) =>
    mutate({
      projectId: project.id,
      newDomain,
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Change</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Change Domain</DialogTitle>
        <Form
          schema={UpdateDomainSchema}
          onSubmit={onSubmit}
          initialValues={{ oldDomain: project.domain }}
          className="flex flex-col space-y-6 text-left"
        >
          {({ formState: { isSubmitting } }) => (
            <>
              <FormField
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
              <FormField
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
              <FormField
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
              <Button disabled={isSubmitting} variant="destructive">
                {isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm domain change
              </Button>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
