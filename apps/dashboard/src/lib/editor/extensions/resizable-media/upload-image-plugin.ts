import type { EditorState } from "@tiptap/pm/state";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { toast } from "sonner";

export type UploadFunctionType = (file: File) => Promise<string>;

const uploadKey = new PluginKey("media-paste-drop");

export const UploadImagesPlugin = (upload: UploadFunctionType) => {
  return new Plugin({
    key: uploadKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc);
        // See if the transaction adds or removes any placeholders
        // @ts-expect-error err
        const action = tr.getMeta(this);
        if (action?.add) {
          const { id, pos, src } = action.add;

          const placeholder = document.createElement("div");
          placeholder.setAttribute("class", "img-placeholder");
          const image = document.createElement("img");
          image.setAttribute(
            "class",
            "opacity-40 rounded-lg border border-stone-200",
          );
          image.src = src;
          placeholder.appendChild(image);
          const deco = Decoration.widget(pos + 1, placeholder, {
            id,
          });
          set = set.add(tr.doc, [deco]);
        } else if (action?.remove) {
          set = set.remove(
            set.find(
              undefined,
              undefined,
              (spec) => spec.id == action.remove.id,
            ),
          );
        }
        return set;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
      handlePaste(view, event) {
        const files = Array.from(event.clipboardData?.files ?? []);

        if (files.length === 0) {
          return false;
        }

        event.preventDefault();

        const pos = view.state.selection.from;

        startImageUpload(upload, files, view, pos);

        return true;
      },
      handleDrop(view, event, _slice, moved) {
        const files = Array.from(event.dataTransfer?.files ?? []);

        if (moved || files.length === 0) {
          return false;
        }

        event.preventDefault();

        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

        // here we deduct 1 from the pos or else the image will create an extra node
        startImageUpload(upload, files, view, coordinates?.pos ?? 0 - 1);

        return true;
      },
    },
  });
};

function findPlaceholder(state: EditorState, id: {}) {
  const decos = uploadKey.getState(state);
  const found = decos.find(null, null, (spec: any) => spec.id == id);
  return found.length ? found[0].from : null;
}

function startImageUpload(
  upload: UploadFunctionType,
  files: File[],
  view: EditorView,
  pos: number,
) {
  files.forEach((file) => {
    if (!file?.type.includes("image/")) {
      toast.error("File type not supported");
      return;
    }

    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return;
    }

    // A fresh object to act as the ID for this upload
    const id = {};

    // Replace the selection with a placeholder
    const tr = view.state.tr;
    if (!tr.selection.empty) tr.deleteSelection();

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      tr.setMeta(uploadKey, {
        add: {
          id,
          pos,
          src: reader.result,
        },
      });
      view.dispatch(tr);
    };

    if (upload && file) {
      toast.promise(
        upload(file).then((src) => {
          const { schema } = view.state;

          const pos = findPlaceholder(view.state, id);
          // If the content around the placeholder has been deleted, drop
          // the image
          if (pos == null) return;

          const node = schema.nodes.resizableMedia!.create({
            src,
            alt: file.name,
            title: file.name,
            "media-type": file.type.startsWith("image") ? "img" : "video",
          });
          const transaction = view.state.tr
            .replaceWith(pos, pos, node)
            .setMeta(uploadKey, { remove: { id } });
          view.dispatch(transaction);
        }),
        {
          loading: "Uploading...",
          success: "Uploaded",
          error: (e) => `Failed to upload ${e}`,
        },
      );
    }
  });
}
