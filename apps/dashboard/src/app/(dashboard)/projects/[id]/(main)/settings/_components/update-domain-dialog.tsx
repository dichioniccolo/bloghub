"use client";

import { useState } from "react";

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { updateDomain } from "~/lib/shared/actions/update-domain";
import { type GetProject } from "~/lib/shared/api/projects";
import {
  UpdateDomainSchema,
  type UpdateDomainSchemaType,
} from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";

type Props = {
  project: NonNullable<GetProject>;
};

export function UpdateDomainDialog({ project }: Props) {
  const [open, setOpen] = useState(false);

  const { mutate } = useZact(updateDomain);

  const onSubmit = async ({ oldDomain, newDomain }: UpdateDomainSchemaType) => {
    try {
      await mutate({
        projectId: project.id,
        oldDomain,
        newDomain,
      });

      setOpen(false);
    } catch {
      //
    }
  };

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
