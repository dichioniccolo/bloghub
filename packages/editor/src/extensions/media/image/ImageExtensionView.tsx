/* eslint-disable @next/next/no-img-element */
import { useCallback, useRef, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { Loader2, UploadCloud } from "lucide-react";
import Dropzone from "react-dropzone";

import { createProjectMedia } from "@acme/common/actions";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useEventListener,
} from "@acme/ui";

import { determineMediaType } from "../../../lib/utils";
import { type MediaNodeProps } from "../types";

type Attrs = {
  id: string;
  src?: string | null;
  alt: string;
  title: string;
};

export function ImageExtensionView(
  userId?: string,
  projectId?: string,
  postId?: string,
) {
  return function ImageExtensionView({
    node,
    updateAttributes,
    deleteNode,
  }: MediaNodeProps<Attrs>) {
    const { src, alt, title } = node.attrs;

    const ref = useRef<HTMLDivElement>(null);

    const [localSrc, setLocalSrc] = useState<string | null | undefined>(src);
    const [loading, setLoading] = useState(false);

    const onKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Delete") {
          deleteNode();
        }
      },
      [deleteNode],
    );

    useEventListener("keydown", onKeyDown, ref);

    const uploadMedia = useCallback(
      async (files: File[]) => {
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

        node.attrs.src = media.url;
        setLocalSrc(media.url);
        updateAttributes({
          src: media.url,
          alt: file.name,
          title: file.name,
        });
        setLoading(false);
      },
      [updateAttributes, node.attrs],
    );

    return (
      <NodeViewWrapper as="div" id={node.attrs.id}>
        <div ref={ref} className="relative">
          {localSrc && (
            <div className="group relative">
              <img src={localSrc} alt={alt} title={title} />
            </div>
          )}
          {!localSrc && userId && projectId && postId && (
            <Tabs defaultValue="local">
              <TabsList>
                <TabsTrigger value="local">Upload</TabsTrigger>
                <TabsTrigger value="other" disabled>
                  Coming soon...
                </TabsTrigger>
              </TabsList>
              <TabsContent value="local">
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
                      <UploadCloud size={21} className="mb-2" />

                      <div className="z-10 flex flex-col justify-center gap-y-1 text-center text-xs">
                        <span className="font-body">Drag and drop or</span>
                        <span className="font-semibold">browse</span>
                      </div>
                      {loading && <Loader2 className="mt-2 animate-spin" />}
                    </div>
                  )}
                </Dropzone>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </NodeViewWrapper>
    );
  };
}
