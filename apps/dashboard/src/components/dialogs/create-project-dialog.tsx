"use client";

import { useCallback, useState } from "react";
import { useUser } from "@clerk/nextjs";

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

import { createProject } from "~/lib/shared/actions";
import { generateDomainFromName } from "~/lib/utils";
import { CreateProjectSchema } from "~/lib/validation/schema";
import { Icons } from "../icons";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

function CreateProjectDialog({ open, setOpen }: Props) {
  const data = useUser();
  // const [optimisticProject, addOptimisticProject] = experimental_useOptimistic(
  //   {
  //     creating: false,
  //   },
  //   (state, _action) => ({
  //     ...state,
  //     creating: true,
  //   }),
  // );
  // const { toast } = useToast();

  // const router = useRouter();

  // async function onSubmit({ name, domain }: CreateProjectSchemaType) {
  //   const { data } = await createProjectMutation({
  //     variables: {
  //       input: {
  //         name,
  //         domain,
  //       },
  //     },
  //   });

  //   if (!data?.project) {
  //     return toast({
  //       variant: "destructive",
  //       description: "Project could not be created",
  //     });
  //   }

  //   setOpen(false);

  //   toast({
  //     description: "Project created",
  //   });

  //   startTransition(() => {
  //     router.refresh();
  //   });
  // }

  if (!data.user) {
    return null;
  }

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
          action={(form) => createProject(data.user.id, form)}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
    () => <CreateProjectDialog open={open} setOpen={setOpen} />,
    [open, setOpen],
  );

  return {
    setOpen,
    CreateProjectDialog: CreateProjectDialogCallback,
  };
}
