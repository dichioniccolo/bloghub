import type { Config } from "tailwindcss";

import baseConfig from "@bloghub/tailwind-config";

export default {
  content: [
    ...baseConfig.content,
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/editor/src/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
} satisfies Config;
