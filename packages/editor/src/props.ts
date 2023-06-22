import { type EditorProps } from "@tiptap/pm/view";

export const TiptapEditorProps: EditorProps = {
  attributes: {
    class: "prose-lg prose-headings:font-display focus:outline-none",
  },
  handleDOMEvents: {
    keydown: (_view, event) => {
      // Prevents the editor from handling the Enter key when slash commands are active
      if (event.key === "Enter" && !event.shiftKey) {
        return true;
      }
    },
  },
};
