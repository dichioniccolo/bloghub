/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from "react";
import { type Editor } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/react";
import Dropzone from "react-dropzone";

import { mediaTypeEnum } from "@acme/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { determineMediaType } from "~/lib/editor";
import { createProjectMedia } from "~/lib/shared/actions/project/create-project-media";

type Attrs = {
  id: string;
  src?: string | null;
  alt: string;
  title: string;
};

type Props = {
  node: {
    editor: Editor;
    attrs: Attrs;
  };
  updateAttributes: (attrs: Partial<Attrs>) => void;
};

export function MediaExtensionView(
  userId: string,
  projectId: string,
  postId: string,
  mediaType: (typeof mediaTypeEnum.enumValues)[number],
) {
  return function MediaExtensionView({ node, updateAttributes }: Props) {
    const { src, alt, title } = node.attrs;

    const accept =
      mediaType === mediaTypeEnum.enumValues[0] ? "image/*" : "video/*";

    const [localSrc, setLocalSrc] = useState<string | null | undefined>(src);
    const [loading, setLoading] = useState(false);

    const uploadMedia = useCallback(
      async (files: File[]) => {
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
        <div className="relative">
          {localSrc && (
            <div className="group relative">
              <img src={localSrc} alt={alt} title={title} />
            </div>
          )}
          {!localSrc && (
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
                  accept={{ [accept]: [] }}
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
                      <Icons.uploadCloud size={21} className="mb-2" />

                      <div className="z-10 flex flex-col justify-center gap-y-1 text-center text-xs">
                        <span className="font-body">Drag and drop or</span>
                        <span className="font-semibold">browse</span>
                      </div>
                      {loading && (
                        <Icons.spinner className="mt-2 animate-spin" />
                      )}
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
