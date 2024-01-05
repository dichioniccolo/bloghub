import * as path from "path";
import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
  content: [
    ...baseConfig.content,
    path.join(
      path.dirname(require.resolve("@acme/ui")),
      "**/*.{js,ts,jsx,tsx}",
    ),
    path.join(
      path.dirname(require.resolve("@acme/editor")),
      "**/*.{js,ts,jsx,tsx}",
    ),
  ],
  presets: [baseConfig],
} satisfies Config;
