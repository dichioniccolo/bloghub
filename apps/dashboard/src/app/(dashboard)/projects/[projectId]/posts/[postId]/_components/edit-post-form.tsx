"use client";

import { useCallback, useState } from "react";

import { Badge } from "@acme/ui/components/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@acme/ui/components/form";
import { Input } from "@acme/ui/components/input";
import { AutoSave, Form } from "@acme/ui/components/zod-form";
import { useZact } from "@acme/zact/client";

import { updatePost } from "~/app/_actions/post/update-post";
import { type GetPost } from "~/app/_api/posts";
import {
  EditPostSchema,
  type EditPostSchemaType,
} from "~/lib/validation/schema";
import { Editor } from "./editor";

type Props = {
  post: NonNullable<GetPost>;
};

export function EditPostForm({ post }: Props) {
  const [formStatus, setFormStatus] = useState<"unsaved" | "saving" | "saved">(
    "saved",
  );

  const { mutate } = useZact(updatePost, {
    onSuccess: () => setFormStatus("saved"),
  });

  const onSubmit = useCallback(
    async ({ title, content }: EditPostSchemaType) => {
      setFormStatus("saving");
      await mutate({
        projectId: post.projectId,
        postId: post.id,
        body: {
          title,
          content: JSON.stringify(content),
        },
      });
    },
    [mutate, post.id, post.projectId],
  );

  const initialValues = {
    title: post.title ?? "",
    content: post.content ?? {},
  };

  return (
    <Form
      schema={EditPostSchema}
      onSubmit={onSubmit}
      initialValues={initialValues}
      className="grid grid-cols-1 gap-2 overflow-hidden"
      disableOnSubmitting={false}
    >
      <AutoSave
        onSubmit={onSubmit}
        initialValues={initialValues}
        delay={2500}
      />
      <div className="relative">
        <Badge className="absolute right-5 top-2">
          {formStatus === "unsaved"
            ? "Unsaved"
            : formStatus === "saving"
            ? "Saving..."
            : "Saved"}
        </Badge>
      </div>
      <FormField
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                value={field.value}
                onChange={field.onChange}
                placeholder="What's the title?"
                className="rounded-md border-0 bg-transparent px-0 py-4 text-4xl outline-none focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
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
                setStatus={setFormStatus}
                projectId={post.projectId}
                postId={post.id}
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
