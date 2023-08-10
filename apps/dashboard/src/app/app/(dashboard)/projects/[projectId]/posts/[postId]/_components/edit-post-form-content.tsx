"use client";

import { useCallback } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { TextareaAutosize } from "~/components/ui/textarea-autosize";
import { AutoSave, Form } from "~/components/ui/zod-form";
import { updatePost } from "~/app/_actions/post/update-post";
import type { GetPost } from "~/app/_api/posts";
import { cn } from "~/lib/utils";
import type { EditPostSchemaType } from "~/lib/validation/schema";
import { EditPostSchema } from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";
import { Editor } from "./editor";

type Props = {
  preview: boolean;
  post: NonNullable<GetPost>;
  formStatus: "saving" | "saved";
  formStatusChanged(status: "saving" | "saved"): void;
};

export function EditPostFormContent({
  preview,
  post,
  formStatusChanged,
}: Props) {
  const { mutate } = useZact(updatePost, {
    onSuccess: () => formStatusChanged("saved"),
  });

  const onSubmit = useCallback(
    async ({ title, description, content }: EditPostSchemaType) => {
      formStatusChanged("saving");
      await mutate({
        projectId: post.projectId,
        postId: post.id,
        body: {
          title,
          description,
          content: JSON.stringify(content),
        },
      });
    },
    [formStatusChanged, mutate, post.id, post.projectId],
  );

  const initialValues = {
    title: post.title ?? "",
    description: post.description ?? "",
    content: post.content ?? {},
  };

  return (
    <Form
      schema={EditPostSchema}
      onSubmit={onSubmit}
      initialValues={initialValues}
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
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      <FormField
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Editor
                projectId={post.projectId}
                postId={post.id}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
