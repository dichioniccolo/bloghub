import { Ban, Loader2 } from "lucide-react";

import { CloudSave } from "@acme/ui/icons/cloud-save";

import type { GetPost } from "~/app/_api/posts";
import { PublishSheet } from "./publish-sheet";
import { UnpublishButton } from "./unpublish-button";

interface Props {
  post: NonNullable<GetPost>;
  formStatus: "saving" | "saved" | "error";
  preview: boolean;
  onPreviewChange(preview: boolean): void;
}

export function EditPostFormToolbar({ post, formStatus }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 gap-2">
        {formStatus === "saving" && (
          <span className="flex">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Saving...
          </span>
        )}
        {formStatus === "saved" && (
          <span className="flex">
            <CloudSave className="mr-2 h-6 w-6 shrink-0 fill-current text-green-500" />
            Saved
          </span>
        )}
        {formStatus === "error" && (
          <span className="flex">
            <Ban className="mr-2 h-6 w-6 shrink-0 fill-current text-red-500" />
            Error while saving
          </span>
        )}
      </div>
      <div className="flex items-center justify-end gap-2">
        {!post.hidden && <UnpublishButton post={post} />}
        <PublishSheet post={post} />
      </div>
    </div>
  );
}
