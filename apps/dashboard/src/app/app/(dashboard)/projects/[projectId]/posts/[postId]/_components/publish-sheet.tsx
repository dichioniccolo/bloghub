"use client";

import { Loader2, Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import { updatePostSettings } from "~/app/_actions/post/update-post-settings";

import type { GetPost } from "~/app/_api/posts";
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
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Form } from "~/components/ui/zod-form";
import type { PublishPostSchemaType } from "~/lib/validation/schema";
import { PublishPostSchema } from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";

type Props = {
  post: NonNullable<GetPost>;
};

export function PublishSheet({ post }: Props) {
  const [open, setOpen] = useState(false);

  const [slugEditable, setSlugEditable] = useState(false);

  const { mutate, isRunning } = useZact(updatePostSettings)

  const onSubmit = useCallback(async ({ slug }: PublishPostSchemaType) => {
    await mutate({
      projectId: post.projectId,
      postId: post.id,
      slug
    })
  }, [mutate, post]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Publish</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            Publish {post.title ?? "Post"}
          </SheetTitle>
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
          {({ setFocus, formState: { isSubmitting } }) => (
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
                        <button
                          type="button"
                          onClick={() => {
                            setSlugEditable((x) => !x);
                            setFocus("slug");
                          }}
                          className="absolute inset-y-0 right-2 flex items-center justify-center"
                        >
                          <Pencil />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      The URL of your post. You can change it later, but it will
                      break any links to your post. Only letters, numbers, and
                      dashes are allowed.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <SheetFooter>
                <Button variant='outline' type="submit">
                  {isRunning && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                  Save
                </Button>
              </SheetFooter>
            </div>

          )}
        </Form>
      </SheetContent>
    </Sheet>
  );
}
