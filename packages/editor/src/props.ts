import { type EditorProps } from "@tiptap/pm/view";

export const TiptapEditorProps: EditorProps = {
  attributes: {
    class:
      "prose-lg prose-headings:font-display focus:outline-none prose-img:rounded-md prose-img:border prose-img:border-stone-200",
  },
  handleDOMEvents: {
    keydown: (_view, event) => {
      // Prevents the editor from handling the Enter key when slash commands are active

      return event.key === "Enter";
    },
  },
};
