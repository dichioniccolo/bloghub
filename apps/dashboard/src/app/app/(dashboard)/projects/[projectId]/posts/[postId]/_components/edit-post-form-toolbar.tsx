import { Loader2 } from "lucide-react";

import { CloudSave } from "~/components/icons/cloud-save";
import type { GetPost } from "~/app/_api/posts";
import { PublishSheet } from "./publish-sheet";
import { UnpublishButton } from "./unpublish-button";

type Props = {
  post: NonNullable<GetPost>;
  formStatus: "saving" | "saved";
};

export function EditPostFormToolbar({ post, formStatus }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1">
        {formStatus === "saving" && (
          <span className="flex">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Saving...
          </span>
        )}
        {formStatus === "saved" && (
          <span className="flex">
            <CloudSave className="mr-2 w-5 shrink-0 fill-current" />
            Saved
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
