import { Loader2 } from "lucide-react";

import type { GetPost } from "~/app/_api/posts";
import { CloudSave } from "~/components/icons/cloud-save";
import { PublishSheet } from "./publish-sheet";
import { UnpublishButton } from "./unpublish-button";

interface Props {
  post: NonNullable<GetPost>;
  formStatus: "saving" | "saved";
  preview: boolean;
  onPreviewChange(preview: boolean): void;
}

export function EditPostFormToolbar({ post, formStatus }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 gap-2">
        <div className="w-24">
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
        </div>
        {/* <div className="flex items-center space-x-2">
          <Switch
            id="preview-mode"
            checked={preview}
            onCheckedChange={onPreviewChange}
          />
          <Label htmlFor="preview-mode">Preview</Label>
        </div> */}
      </div>
      <div className="flex items-center justify-end gap-2">
        {!post.hidden && <UnpublishButton post={post} />}
        <PublishSheet post={post} />
      </div>
    </div>
  );
}
