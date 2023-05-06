import path from "path";
import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
  content: [
    path.join(
      path.dirname(require.resolve("@acme/ui")),
      "**/*.{js,jsx,ts,tsx}",
    ),
    "./src/**/*.tsx",
  ],
  presets: [baseConfig],
} satisfies Config;
