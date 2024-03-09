"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

import { determineMediaType } from "@acme/lib/utils";
import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/components/ui/form";
import { Input } from "@acme/ui/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@acme/ui/components/ui/sheet";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { updatePostSettings } from "~/app/_actions/post/update-post-settings";
import { createProjectMedia } from "~/app/_actions/project/create-project-media";
import type { GetPost } from "~/app/_api/posts";
import type { PublishPostSchemaType } from "~/lib/validation/schema";
import { PublishPostSchema } from "~/lib/validation/schema";

interface Props {
  post: NonNullable<GetPost>;
}

export function PublishSheet({ post }: Props) {
  const [open, setOpen] = useState(false);

  const { action, status } = useServerAction(updatePostSettings, {
    onSuccess() {
      setOpen(false);
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onSubmit = ({
    thumbnailUrl,
    seoTitle,
    seoDescription,
  }: PublishPostSchemaType) =>
    action({
      projectId: post.projectId,
      postId: post.id,
      data: {
        thumbnailUrl,
        seoTitle,
        seoDescription,
      },
    });

  const uploadThumbnail = async (files: File[]) => {
    const file = files?.[0];

    if (!file) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", determineMediaType(file));
    formData.append("projectId", post.projectId);
    formData.append("postId", post.id);
    formData.append("forEntity", "POST_THUMBNAIL"); // MediaForEntity.PostThumbnail

    const media = await createProjectMedia(formData);

    if (!media) {
      return;
    }

    return media.url;
  };

  const form = useZodForm({
    schema: PublishPostSchema,
    defaultValues: {
      thumbnailUrl: post.thumbnailUrl ?? "",
      seoTitle: post.seoTitle ?? "",
      seoDescription: post.seoDescription ?? "",
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          {post.hidden ? "Publish" : "Settings"}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] max-w-none overflow-y-auto sm:w-[700px] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>Publish {post.title ?? "Post"}</SheetTitle>
          <SheetDescription>
            Make changes to your post settings before publishing it.
          </SheetDescription>
        </SheetHeader>
        <Form form={form} onSubmit={onSubmit}>
          <div className="grid gap-2">
            <FormField<PublishPostSchemaType>
              name="thumbnailUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <>
                      {form.watch("thumbnailUrl") ? (
                        <div className="group relative flex w-full rounded-md transition-all ease-in-out">
                          <Image
                            alt={post.title ?? "Post image"}
                            width={1200}
                            height={630}
                            className="h-full w-full object-contain"
                            src={
                              form.watch("thumbnailUrl") ??
                              "/_static/placeholder.png"
                            }
                          />
                          <div className="absolute right-2 top-2 box-border hidden overflow-hidden rounded-sm border border-slate-200 bg-white shadow-xl transition-all duration-200 ease-linear group-hover:flex">
                            <button
                              type="button"
                              className={cn(
                                "inline-flex h-8 items-center rounded-none border border-transparent bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-200",
                              )}
                              onClick={() => {
                                form.setValue("thumbnailUrl", null);
                              }}
                            >
                              <Trash2 />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <Dropzone
                          onDrop={async (files) => {
                            const url = await uploadThumbnail(files);
                            form.setValue("thumbnailUrl", url);
                          }}
                          accept={{ "image/*": [] }}
                          maxFiles={1}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div
                              tabIndex={-1}
                              onKeyUp={() => {
                                //
                              }}
                              role="button"
                              className="flex cursor-pointer flex-col items-center rounded-md border border-dashed border-border p-4"
                              {...getRootProps()}
                            >
                              <input {...getInputProps()} />
                              <UploadCloud size={21} className="mb-2" />

                              <div className="z-10 flex flex-col justify-center gap-y-1 text-center text-xs">
                                <span>Drag and drop or</span>
                                <span className="font-semibold">browse</span>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                      )}
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField<PublishPostSchemaType>
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoCapitalize="none"
                      autoCorrect="off"
                      placeholder="My awesome post title"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    A custom SEO title for your post.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField<PublishPostSchemaType>
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoCapitalize="none"
                      autoCorrect="off"
                      placeholder="My awesome post description"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    A custom SEO description for your post.
                  </FormDescription>
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button variant="outline" type="submit">
                {status === SubmissionStatus.PENDING && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </SheetFooter>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
