/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

// import { BlockEditor } from "@acme/editor";
import { determineMediaType } from "@acme/lib/utils";
import { useServerAction } from "@acme/server-actions/client";
import { cn } from "@acme/ui";
import { TextareaAutosize } from "@acme/ui/components/textarea-autosize";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@acme/ui/components/ui/form";
import { AutoSave, Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { updatePost } from "~/app/_actions/post/update-post";
import { createProjectMedia } from "~/app/_actions/project/create-project-media";
import type { GetPost } from "~/app/_api/posts";
import type { EditPostSchemaType } from "~/lib/validation/schema";
import { EditPostSchema } from "~/lib/validation/schema";

interface Props {
  preview: boolean;
  post: NonNullable<GetPost>;
  formStatus: "saving" | "saved" | "error";
  formStatusChanged(status: "saving" | "saved" | "error"): void;
}

const BlockEditor = dynamic(
  () => import("@acme/editor").then((x) => x.BlockEditor),
  {
    ssr: false,
  },
);

export function EditPostFormContent({
  preview,
  post,
  formStatusChanged,
}: Props) {
  const { action } = useServerAction(updatePost, {
    onSuccess: () => formStatusChanged("saved"),
    onServerError(error) {
      error && toast.error(error);
      formStatusChanged("error");
    },
  });

  const onSubmit = useCallback(
    ({ title, description, content }: EditPostSchemaType) => {
      formStatusChanged("saving");

      if (!content) {
        throw new Error("Content is required");
      }

      const contentBuffer = Buffer.from(JSON.stringify(content)).toString(
        "base64",
      );

      action({
        projectId: post.projectId,
        postId: post.id,
        body: {
          title,
          description,
          content: contentBuffer,
        },
      });
    },
    [formStatusChanged, action, post.id, post.projectId],
  );

  const initialValues = {
    title: post.title ?? "",
    description: post.description ?? "",
    content: post.content,
  };

  const form = useZodForm({
    schema: EditPostSchema,
    defaultValues: initialValues,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", determineMediaType(file));
      formData.append("projectId", post.projectId);
      formData.append("postId", post.id);
      formData.append("forEntity", "POST_CONTENT"); // MediaForEntity.PostContent

      const media = await createProjectMedia(formData);

      return media?.url ?? "";
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
        <FormField<EditPostSchemaType>
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
        <FormField<EditPostSchemaType>
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

      <BlockEditor
        initialContent={post.content}
        onDebouncedUpdate={(content) =>
          onSubmit({
            title: form.getValues("title"),
            description: form.getValues("description"),
            content,
          })
        }
        onUpload={uploadFile}
      />
    </>
  );
}
