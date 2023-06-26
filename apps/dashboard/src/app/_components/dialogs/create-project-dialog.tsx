"use client";

import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";

import { Button } from "@acme/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useZact } from "@acme/zact/client";

import { createProject } from "~/app/_actions/project/create-project";
import { Icons } from "~/app/_components/icons";
import {
  CreateProjectSchema,
  type CreateProjectSchemaType,
} from "~/lib/validation/schema";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function CreateProjectDialog({ open, setOpen }: Props) {
  const { mutate } = useZact(createProject, {
    onSuccess: () => {
      toast.success("Project created");
      setOpen(false);
    },
  });

  const onSubmit = ({ name, domain }: CreateProjectSchemaType) =>
    mutate({
      name,
      domain,
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-4">
            <span>Create a new project</span>
          </DialogTitle>
        </DialogHeader>
        <Form
          schema={CreateProjectSchema}
          onSubmit={onSubmit}
          className="flex flex-col space-y-6 text-left"
          initialValues={{
            name: "",
            domain: "",
          }}
        >
          {({ formState: { isSubmitting } }) => (
            <>
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isSubmitting}>
                {isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create project
              </Button>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function useCreateProjectDialog() {
  const [open, setOpen] = useState(false);

  const CreateProjectDialogCallback = useCallback(
    () => <CreateProjectDialog open={open} setOpen={setOpen} />,
    [open, setOpen],
  );

  return {
    setOpen,
    CreateProjectDialog: CreateProjectDialogCallback,
  };
}
