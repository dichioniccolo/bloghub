"use client";

import { useCallback, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

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
  inputVariants,
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

  const { mutate } = useZact(createPost);

  async function onSubmit({ title, description }: CreatePostSchemaType) {
    await mutate({
      userId: user.id,
      projectId,
      title,
      description,
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
              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TextareaAutosize
                        {...field}
                        disabled={isSubmitting}
                        placeholder="A description for your post"
                        className={inputVariants({})}
                        minRows={4}
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
