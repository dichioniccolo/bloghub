import path from "path";
import baseConfig from "@bloghub/tailwind-config";
import type { Config } from "tailwindcss";

export default {
  content: [
    path.join(
      path.dirname(require.resolve("@bloghub/ui")),
      "**/*.{js,jsx,ts,tsx}",
    ),
    path.join(
      path.dirname(require.resolve("@bloghub/editor")),
      "**/*.{js,jsx,ts,tsx}",
    ),
    "./src/**/*.tsx",
  ],
  presets: [baseConfig],
} satisfies Config;
