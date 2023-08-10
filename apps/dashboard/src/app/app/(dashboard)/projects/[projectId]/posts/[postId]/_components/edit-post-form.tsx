"use client";

import { useState } from "react";

import type { GetPost } from "~/app/_api/posts";
import { EditPostFormContent } from "./edit-post-form-content";
import { EditPostFormToolbar } from "./edit-post-form-toolbar";

type Props = {
  post: NonNullable<GetPost>;
};

export function EditPostForm({ post }: Props) {
  const [formStatus, setFormStatus] = useState<"saving" | "saved">("saved");

  return (
    <div className="mt-4 space-y-4">
      <EditPostFormToolbar post={post} formStatus={formStatus} />
      <EditPostFormContent
        post={post}
        formStatus={formStatus}
        formStatusChanged={setFormStatus}
      />
    </div>
  );
}
