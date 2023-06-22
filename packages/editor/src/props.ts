import { type EditorProps } from "@tiptap/pm/view";

export const TiptapEditorProps: EditorProps = {
  attributes: {
    class: "prose-lg prose-headings:font-display focus:outline-none",
  },
  handleDOMEvents: {
    keydown: (_view, event) => {
      // prevent default event listeners from firing when slash command is active
      if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
        const slashCommand = document.querySelector("#slash-command");
        if (slashCommand) {
          return true;
        }
      }
    },
  },
};
