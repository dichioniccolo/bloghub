/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useCallback } from "react";

import {
  CollaborativeEditor,
  ResizableMediaWithUploader,
  Room,
  SlashCommand,
} from "@acme/editor";
import { determineMediaType, getRoom } from "@acme/lib/utils";
import { cn } from "@acme/ui";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@acme/ui/components/form";
import { TextareaAutosize } from "@acme/ui/components/textarea-autosize";
import { AutoSave, Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { updatePost } from "~/app/_actions/post/update-post";
import { createProjectMedia } from "~/app/_actions/project/create-project-media";
import type { GetPost } from "~/app/_api/posts";
import type { EditPostSchemaType } from "~/lib/validation/schema";
import { EditPostSchema } from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";

interface Props {
  preview: boolean;
  post: NonNullable<GetPost>;
  formStatus: "saving" | "saved";
  formStatusChanged(status: "saving" | "saved"): void;
}

export function EditPostFormContent({
  preview,
  post,
  formStatusChanged,
}: Props) {
  const { mutate } = useZact(updatePost, {
    onSuccess: () => formStatusChanged("saved"),
  });

  const onSubmit = useCallback(
    async ({ title, description }: EditPostSchemaType) => {
      formStatusChanged("saving");
      await mutate({
        projectId: post.projectId,
        postId: post.id,
        body: {
          title,
          description,
        },
      });
    },
    [formStatusChanged, mutate, post.id, post.projectId],
  );

  const initialValues = {
    title: post.title ?? "",
    description: post.description ?? "",
  };

  const form = useZodForm({
    schema: EditPostSchema,
    defaultValues: initialValues,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", determineMediaType(file)?.toString() ?? "");
      formData.append("projectId", post.projectId);
      formData.append("postId", post.id);
      formData.append("forEntity", "1"); // MediaForEntity.PostContent

      const media = await createProjectMedia(formData);

      return media.url;
    },
    [post],
  );

  return (
    <>
      <Form
        form={form}
        onSubmit={onSubmit}
        className={cn("grid grid-cols-1 gap-2", {
          hidden: preview,
        })}
        disableOnSubmitting={false}
      >
        <AutoSave
          onSubmit={onSubmit}
          initialValues={initialValues}
          delay={2500}
        />
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextareaAutosize
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="What's the title?"
                  className="resize-none rounded-none border-none px-0 py-4 text-4xl focus:ring-0 focus-visible:ring-0"
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
              <FormControl>
                <TextareaAutosize
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="What's the description?"
                  className="resize-none rounded-none border-none px-0 py-4 text-2xl focus:ring-0 focus-visible:ring-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <Room roomId={getRoom(post.projectId, post.id)}>
        <CollaborativeEditor
          extensions={[
            SlashCommand,
            ResizableMediaWithUploader.configure({
              uploadFn: uploadFile,
            }),
          ]}
          onDebouncedUpdate={async () => {
            await onSubmit({
              title: form.getValues("title"),
              description: form.getValues("description"),
            });
          }}
        />
      </Room>
    </>
  );
}
