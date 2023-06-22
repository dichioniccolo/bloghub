import { Plugin, PluginKey } from "@tiptap/pm/state";

import { toast } from "@acme/ui";

export type UploadFunctionType = (file: File) => Promise<string>;

export const getMediaPasteDropPlugin = (upload: UploadFunctionType) => {
  return new Plugin({
    key: new PluginKey("media-paste-drop"),
    props: {
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items || []);
        const { schema } = view.state;

        items.forEach((item) => {
          const file = item.getAsFile();

          const isImageOrVideo =
            file?.type.indexOf("image") === 0 ||
            file?.type.indexOf("video") === 0;

          if (isImageOrVideo) {
            event.preventDefault();

            if (upload && file) {
              toast.promise(
                upload(file).then((src) => {
                  const node = schema.nodes.resizableMedia!.create({
                    src,
                    "media-type":
                      file.type.indexOf("image") === 0 ? "img" : "video",
                  });

                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                }),
                {
                  loading: "Uploading...",
                  success: "Uploaded",
                  error: "Failed to upload",
                },
              );
            }
          } else {
            const reader = new FileReader();

            reader.onload = (readerEvent) => {
              const node = schema.nodes.resizableMedia!.create({
                src: readerEvent.target?.result,
                "media-type": "",
              });

              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
            };

            if (!file) return;

            reader.readAsDataURL(file);
          }
        });

        return false;
      },
      handleDrop(view, event) {
        const hasFiles =
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files.length;

        if (!hasFiles) {
          return false;
        }

        const imagesAndVideos = Array.from(
          event.dataTransfer?.files ?? [],
        ).filter(({ type: t }) => /image|video/i.test(t));

        if (imagesAndVideos.length === 0) return false;

        event.preventDefault();

        const { schema } = view.state;

        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

        if (!coordinates) return false;

        imagesAndVideos.forEach((imageOrVideo) => {
          const reader = new FileReader();

          if (upload) {
            toast.promise(
              upload(imageOrVideo).then((src) => {
                const node = schema.nodes.resizableMedia!.create({
                  src,
                  "media-type": imageOrVideo.type.includes("image")
                    ? "img"
                    : "video",
                });

                const transaction = view.state.tr.insert(coordinates.pos, node);

                view.dispatch(transaction);
              }),
              {
                loading: "Uploading...",
                success: "Uploaded",
                error: "Failed to upload",
              },
            );
          } else {
            reader.onload = (readerEvent) => {
              const node = schema.nodes.resizableMedia!.create({
                src: readerEvent.target?.result,

                "media-type": imageOrVideo.type.includes("image")
                  ? "img"
                  : "video",
              });

              const transaction = view.state.tr.insert(coordinates.pos, node);

              view.dispatch(transaction);
            };

            reader.readAsDataURL(imageOrVideo);
          }
        });

        return true;
      },
    },
  });
};
