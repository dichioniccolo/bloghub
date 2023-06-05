"use client";

import TextareaAutosize from "react-textarea-autosize";

import { type Role } from "@acme/db";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@acme/ui";

import { Tiptap } from "~/app/_components/tiptap";
import { LeaveConfirm } from "~/hooks/use-leave-confirm";
import { useUser } from "~/hooks/use-user";
import { updatePost } from "~/lib/shared/actions/update-post";
import { type GetPost } from "~/lib/shared/api/posts";
import {
  EditPostSchema,
  type EditPostSchemaType,
} from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";
import { EditPostFormToolbar } from "./edit-post-form-toolbar";

type Props = {
  post: NonNullable<GetPost>;
  currentUserRole: Role;
};

export function EditPostForm({ post, currentUserRole }: Props) {
  const user = useUser();
  const { mutate } = useZact(updatePost);

  async function onSubmit({ title, content, description }: EditPostSchemaType) {
    await mutate({
      userId: user.id,
      projectId: post.projectId,
      postId: post.id,
      body: {
        title,
        content,
        description,
      },
    });
  }

  return (
    <Form
      schema={EditPostSchema}
      initialValues={{
        title: post.title ?? "",
        content: post.content ?? "",
        description: post.description ?? "",
      }}
      onSubmit={onSubmit}
    >
      {({ formState }) => (
        <>
          <EditPostFormToolbar post={post} currentUserRole={currentUserRole} />
          <LeaveConfirm formState={formState} />
          <FormField
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your project title"
                    autoCapitalize="none"
                    autoComplete="title"
                    autoCorrect="off"
                    disabled={formState.isSubmitting}
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
                    disabled={formState.isSubmitting}
                    placeholder="A description for your post"
                    className="block w-full rounded border-secondary bg-transparent shadow-sm"
                    minRows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-6">
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
          </div>
        </>
      )}
    </Form>
  );
}
