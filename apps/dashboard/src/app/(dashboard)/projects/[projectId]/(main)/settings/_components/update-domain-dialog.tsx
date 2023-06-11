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
  useToast,
} from "@acme/ui";
import { useZact } from "@acme/zact/client";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { updateDomain } from "~/lib/shared/actions/project/update-domain";
import { type GetProject } from "~/lib/shared/api/projects";
import {
  UpdateDomainSchema,
  type UpdateDomainSchemaType,
} from "~/lib/validation/schema";

type Props = {
  project: NonNullable<GetProject>;
};

export function UpdateDomainDialog({ project }: Props) {
  const user = useUser();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { mutate } = useZact(updateDomain);

  const onSubmit = async ({ newDomain }: UpdateDomainSchemaType) => {
    try {
      await mutate({
        userId: user.id,
        projectId: project.id,
        newDomain,
      });

      setOpen(false);
    } catch {
      toast({
        title: "Something went wrong.",
        variant: "destructive",
      });
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
