"use client";

import { useCallback, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  Input,
  Label,
  useToast,
} from "@acme/ui";

import { useUser } from "~/hooks/use-user";
import { createPost } from "~/lib/shared/actions/create-post";
import {
  CreatePostSchema,
  type CreatePostSchemaType,
} from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";
import { Icons } from "../icons";

type Props = {
  projectId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
};

function CreatePostDialog({ projectId, open, setOpen }: Props) {
  const user = useUser();

  const { toast } = useToast();

  const { mutate } = useZact(createPost);

  async function onSubmit({ title }: CreatePostSchemaType) {
    const post = await mutate({
      userId: user.id,
      projectId,
      title,
    });

    if (!post) {
      return toast({
        description: "Post could not be created",
        variant: "destructive",
      });
    }

    setOpen(false);

    toast({
      description: "Post created",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-4">
            <span>Create a new post</span>
          </DialogTitle>
        </DialogHeader>
        <Form
          schema={CreatePostSchema}
          onSubmit={onSubmit}
          className="flex flex-col space-y-6 text-left"
        >
          {({ register, formState: { isSubmitting, errors } }) => (
            <>
              <div className="grid gap-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="A title that suits your post"
                  autoComplete="off"
                  autoCorrect="off"
                  disabled={isSubmitting}
                  {...register("title")}
                />
                {errors?.title && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <Button disabled={isSubmitting}>
                {isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create post
              </Button>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function useCreatePostDialog(projectId: string) {
  const [open, setOpen] = useState(false);

  const CreatePostDialogCallback = useCallback(
    () => (
      <CreatePostDialog projectId={projectId} open={open} setOpen={setOpen} />
    ),
    [open, setOpen, projectId],
  );

  return {
    setOpen,
    CreatePostDialog: CreatePostDialogCallback,
  };
}
