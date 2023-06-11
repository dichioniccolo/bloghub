"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui";
import { useZact } from "@acme/zact/client";

import { Tiptap } from "~/app/_components/tiptap";
import { LeaveConfirm } from "~/hooks/use-leave-confirm";
import { useUser } from "~/hooks/use-user";
import { updatePost } from "~/lib/shared/actions/post/update-post";
import { type GetPost } from "~/lib/shared/api/posts";
import {
  EditPostSchema,
  type EditPostSchemaType,
} from "~/lib/validation/schema";
import { EditPostFormToolbar } from "./edit-post-form-toolbar";

type Props = {
  post: NonNullable<GetPost>;
};

export function EditPostForm({ post }: Props) {
  const user = useUser();
  const { mutate } = useZact(updatePost);

  const onSubmit = ({ content }: EditPostSchemaType) =>
    mutate({
      userId: user.id,
      projectId: post.projectId,
      postId: post.id,
      content,
    });

  return (
    <Form
      schema={EditPostSchema}
      initialValues={{
        content: post.content ?? "",
      }}
      onSubmit={onSubmit}
    >
      {({ formState }) => (
        <>
          <EditPostFormToolbar post={post} />
          <LeaveConfirm formState={formState} />
          <FormField
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post</FormLabel>
                <FormControl>
                  <Tiptap
                    userId={user.id}
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
        </>
      )}
    </Form>
  );
}
