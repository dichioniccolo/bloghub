import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import Dropzone from "react-dropzone";

import { createProjectMedia } from "@acme/common/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui";

import { determineMediaType } from "../../lib/utils";
import { useUploader } from "./context";

type Props = {
  userId?: string;
  projectId?: string;
  postId?: string;
};

export function UploaderDialog({ userId, projectId, postId }: Props) {
  const { editor, open, setOpen, range } = useUploader();

  const [loading, setLoading] = useState(false);

  const uploadMedia = async (files: File[]) => {
    if (!userId || !projectId || !postId) {
      return;
    }

    const file = files[0];

    if (!file) {
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("type", determineMediaType(file) ?? "");
    formData.append("userId", userId);
    formData.append("projectId", projectId);
    formData.append("postId", postId);

    const media = await createProjectMedia(formData);

    if (!media) {
      setLoading(false);
      return;
    }

    range && editor?.commands.deleteRange(range);
    editor?.commands.setImage({
      src: media.url,
      alt: file.name,
      title: file.name,
    });
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uploader</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="local">
          <TabsList>
            <TabsTrigger value="local">Upload</TabsTrigger>
            <TabsTrigger value="other" disabled>
              Coming soon...
            </TabsTrigger>
          </TabsList>
          <TabsContent value="local">
            {loading && <Loader2 size={30} className="animate-spin" />}
            {!loading && (
              <Dropzone
                onDrop={uploadMedia}
                accept={{ "image/*": [] }}
                maxFiles={1}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    tabIndex={-1}
                    onKeyUp={() => {
                      //
                    }}
                    role="button"
                    className="flex cursor-pointer flex-col items-center rounded-md border border-dashed border-gray-200 p-4"
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <UploadCloud size={20} className="mb-2" />

                    <div className="z-10 flex flex-col justify-center gap-y-1 text-center text-xs">
                      <span className="font-body">Drag and drop or</span>
                      <span className="font-semibold">browse</span>
                    </div>
                  </div>
                )}
              </Dropzone>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
