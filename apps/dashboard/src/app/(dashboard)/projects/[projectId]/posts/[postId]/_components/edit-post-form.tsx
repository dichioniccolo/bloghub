"use client";

import { useState } from "react";

import type { GetPost } from "~/app/_api/posts";
import { EditPostFormContent } from "./edit-post-form-content";
import { EditPostFormToolbar } from "./edit-post-form-toolbar";

interface Props {
  post: NonNullable<GetPost>;
}

export function EditPostForm({ post }: Props) {
  const [preview, setPreview] = useState(false);
  const [formStatus, setFormStatus] = useState<"saving" | "saved" | "error">(
    "saved",
  );

  return (
    <div className="mt-4 h-full space-y-4">
      <EditPostFormToolbar
        post={post}
        formStatus={formStatus}
        preview={preview}
        onPreviewChange={setPreview}
      />
      <EditPostFormContent
        post={post}
        formStatus={formStatus}
        formStatusChanged={setFormStatus}
        preview={preview}
      />
    </div>
  );
}
