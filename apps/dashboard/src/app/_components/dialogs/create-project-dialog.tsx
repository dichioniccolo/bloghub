"use client";

import {
  useCallback,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { useZact } from "zact/client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  Input,
  Label,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { createProject } from "~/lib/shared/actions";
import { generateDomainFromName } from "~/lib/utils";
import {
  CreateProjectSchema,
  type CreateProjectSchemaType,
} from "~/lib/validation/schema";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: ReactNode;
};

function CreateProjectDialog({ open, setOpen, children }: Props) {
  const user = useUser();

  const { mutate } = useZact(createProject);

  async function onSubmit({ name, domain }: CreateProjectSchemaType) {
    await mutate({
      userId: user.id,
      name,
      domain,
    });

    setOpen(false);
  }

  // if (!data.user) {
  //   return null;
  // }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-4">
            <span>Create a new project</span>
          </DialogTitle>
        </DialogHeader>
        {children}
        <Form
          schema={CreateProjectSchema}
          onSubmit={onSubmit}
          className="flex flex-col space-y-6 text-left"
        >
          {({ register, setValue, formState: { isSubmitting, errors } }) => (
            <>
              <div className="grid gap-1">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="My project name"
                  autoComplete="project-name"
                  autoCorrect="off"
                  {...register("name", {
                    onChange(e: { target: { value: string } }) {
                      const value = e.target.value;

                      setValue("domain", generateDomainFromName(value));
                    },
                  })}
                />
                {errors?.name && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.name.message?.toString()}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="blog.me.com"
                  autoComplete="domain"
                  autoCorrect="off"
                  {...register("domain")}
                />
                {errors?.domain && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.domain.message?.toString()}
                  </p>
                )}
              </div>
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
    ({ children }: PropsWithChildren) => (
      <CreateProjectDialog open={open} setOpen={setOpen}>
        {children}
      </CreateProjectDialog>
    ),
    [open, setOpen],
  );

  return {
    setOpen,
    CreateProjectDialog: CreateProjectDialogCallback,
  };
}
