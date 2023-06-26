import baseConfig from "@bloghub/tailwind-config";
import type { Config } from "tailwindcss";

export default {
  content: baseConfig.content,
  presets: [baseConfig],
} satisfies Config;
