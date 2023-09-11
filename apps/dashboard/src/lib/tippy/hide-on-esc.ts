import type { Plugin } from "tippy.js";

export const hideOnEsc: Plugin = {
  name: "hideOnEsc",
  defaultValue: true,
  fn({ hide }) {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key === "Esc") {
        hide();
      }
    }

    return {
      onShow() {
        document.addEventListener("keydown", onKeyDown);
      },
      onHide() {
        document.removeEventListener("keydown", onKeyDown);
      },
    };
  },
};
