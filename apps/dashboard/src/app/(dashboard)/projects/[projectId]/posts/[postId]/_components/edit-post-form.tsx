"use client";

import { useCallback, useState } from "react";

import {
  AutoSave,
  Badge,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@acme/ui";
import { useZact } from "@acme/zact/client";

import { useUser } from "~/hooks/use-user";
import { updatePost } from "~/lib/shared/actions/post/update-post";
import { type GetPost } from "~/lib/shared/api/posts";
import {
  EditPostSchema,
  type EditPostSchemaType,
} from "~/lib/validation/schema";
import { Editor } from "./editor";

type Props = {
  post: NonNullable<GetPost>;
};

export function EditPostForm({ post }: Props) {
  const user = useUser();

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
        userId: user.id,
        projectId: post.projectId,
        postId: post.id,
        body: {
          title,
          content: JSON.stringify(content),
        },
      });
    },
    [mutate, post.id, post.projectId, user.id],
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
      className="relative grid grid-cols-1 gap-2 overflow-hidden"
      disableOnSubmitting={false}
    >
      <AutoSave onSubmit={onSubmit} initialValues={initialValues} />
      <Badge className="absolute right-5 top-2">
        {formStatus === "unsaved"
          ? "Unsaved"
          : formStatus === "saving"
          ? "Saving..."
          : "Saved"}
      </Badge>
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
