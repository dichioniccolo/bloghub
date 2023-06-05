import { Plugin } from "@tiptap/pm/state";

import { determineMediaType } from "~/lib/editor";
import { createProjectMedia } from "~/lib/shared/actions/create-project-media";

export function dropVideoPlugin(
  userId: string,
  projectId: string,
  postId: string,
) {
  return new Plugin({
    props: {
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items ?? []);
        const { schema } = view.state;

        items.forEach(async (item) => {
          const file = item.getAsFile();

          if (!file || !/video/i.test(file.type)) {
            return;
          }

          event.preventDefault();

          const formData = new FormData();

          formData.append("file", file);
          formData.append("type", determineMediaType(file) ?? "");
          formData.append("userId", userId);
          formData.append("projectId", projectId);
          formData.append("postId", postId);

          const media = await createProjectMedia(formData);

          const node = schema.nodes.video?.create({
            src: media.url,
            alt: file.name,
            title: file.name,
          });

          if (!node) {
            return;
          }

          const transaction = view.state.tr.replaceSelectionWith(node);

          view.dispatch(transaction);
        });

        return false;
      },
      handleDOMEvents: {
        drop: (view, event) => {
          const hasFiles =
            event.dataTransfer &&
            event.dataTransfer.files &&
            event.dataTransfer.files.length;

          if (!hasFiles) {
            return false;
          }

          const videos = Array.from(event.dataTransfer.files).filter((file) =>
            /video/i.test(file.type),
          );

          if (videos.length === 0) {
            return false;
          }

          event.preventDefault();

          const { schema } = view.state;

          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });

          if (!coordinates) {
            return false;
          }

          videos.forEach(async (file) => {
            const formData = new FormData();

            formData.append("file", file);
            formData.append("type", determineMediaType(file) ?? "");
            formData.append("userId", userId);
            formData.append("projectId", projectId);
            formData.append("postId", postId);

            const media = await createProjectMedia(formData);

            const node = schema.nodes.video?.create({
              src: media.url,
              alt: file.name,
              title: file.name,
            });

            if (!node) {
              return;
            }

            const transaction = view.state.tr.insert(coordinates.pos, node);
            view.dispatch(transaction);
          });

          return true;
        },
      },
    },
  });
}
