"use client";

import { useState } from "react";
import { Check, Loader2, Pencil } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Form } from "~/components/ui/zod-form";
import { updatePostSettings } from "~/app/_actions/post/update-post-settings";
import type { GetPost } from "~/app/_api/posts";
import type { PublishPostSchemaType } from "~/lib/validation/schema";
import { PublishPostSchema } from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";

type Props = {
  post: NonNullable<GetPost>;
};

export function PublishSheet({ post }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);

  const [slugEditable, setSlugEditable] = useState(post.hidden);

  const { mutate, isRunning } = useZact(updatePostSettings);

  const onSubmit = ({ slug }: PublishPostSchemaType) =>
    mutate({
      projectId: post.projectId,
      postId: post.id,
      slug,
    });

  const onEnableSlugEditing = () => {
    if (!post.hidden) {
      setConfirmEditOpen(true);
      return;
    }

    setSlugEditable(true);
  };

  const onForceEnableEditing = () => {
    setSlugEditable(true);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">Publish</Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Publish {post.title ?? "Post"}</SheetTitle>
            <SheetDescription>
              Make changes to your post settings before publishing it.
            </SheetDescription>
          </SheetHeader>
          <Form
            schema={PublishPostSchema}
            initialValues={{
              slug: post.slug,
            }}
            onSubmit={onSubmit}
          >
            {({ formState: { isSubmitting } }) => (
              <div className="grid gap-2">
                <FormField
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <div className="relative flex">
                          <Input
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isSubmitting || !slugEditable}
                            {...field}
                          />
                          {!slugEditable ? (
                            <button
                              type="button"
                              onClick={onEnableSlugEditing}
                              className="absolute inset-y-0 right-2 flex items-center justify-center"
                            >
                              <Pencil />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSlugEditable(false)}
                              className="absolute inset-y-0 right-2 flex items-center justify-center"
                            >
                              <Check />
                            </button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        The URL of your post. Only letters, numbers, and dashes
                        are allowed.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <SheetFooter>
                  <Button variant="outline" type="submit">
                    {isRunning && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save
                  </Button>
                </SheetFooter>
              </div>
            )}
          </Form>
        </SheetContent>
      </Sheet>
      <AlertDialog open={confirmEditOpen} onOpenChange={setConfirmEditOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              By changing the slug of this post, you will break any links that
              users may have saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onForceEnableEditing}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
