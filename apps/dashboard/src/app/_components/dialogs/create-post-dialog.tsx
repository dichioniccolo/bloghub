"use client";

import { useCallback, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
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
      toast({
        title: "Post could not be created",
        variant: "destructive",
      });
      return;
    }

    setOpen(false);

    toast({
      title: "Post created",
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
          {({ formState: { isSubmitting } }) => (
            <>
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A title that suits your post"
                        autoComplete="off"
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
