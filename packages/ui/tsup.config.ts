import { readFile, writeFile } from "fs/promises";
import type { Options } from "tsup";
import { defineConfig } from "tsup";

const client = [
  "./src/accordion.tsx",
  "./src/alert-dialog.tsx",
  "./src/aspect-ratio.tsx",
  "./src/avatar.tsx",
  "./src/calendar.tsx",
  "./src/checkbox.tsx",
  "./src/collapsible.tsx",
  "./src/command.tsx",
  "./src/context-menu.tsx",
  "./src/dialog.tsx",
  "./src/dropdown-menu.tsx",
  "./src/hooks.tsx",
  "./src/hover-card.tsx",
  "./src/label.tsx",
  "./src/menubar.tsx",
  "./src/popover.tsx",
  "./src/progress.tsx",
  "./src/radio-group.tsx",
  "./src/scroll-area.tsx",
  "./src/select.tsx",
  "./src/separator.tsx",
  "./src/sheet.tsx",
  "./src/slider.tsx",
  "./src/switch.tsx",
  "./src/tabs.tsx",
  "./src/toggle.tsx",
  "./src/tooltip.tsx",
  "./src/zod-form.tsx",
];

const server = [
  "./src/alert.tsx",
  "./src/badge.tsx",
  "./src/button.tsx",
  "./src/card.tsx",
  "./src/form.tsx",
  "./src/input.tsx",
  "./src/navigation-menu.tsx",
  "./src/skeleton.tsx",
  "./src/table.tsx",
  "./src/textarea.tsx",
];

export default defineConfig((opts) => {
  const common = {
    clean: !opts.watch,
    dts: true,
    format: ["esm"],
    minify: true,
    outDir: "dist",
  } satisfies Options;

  return [
    {
      // separate not to inject the banner
      ...common,
      entry: ["./src/index.ts", ...server],
    },
    {
      ...common,
      entry: client,
      esbuildOptions: (opts) => {
        opts.banner = {
          js: '"use client";',
        };
      },
      async onSuccess() {
        const pkgJson = JSON.parse(
          await readFile("./package.json", {
            encoding: "utf-8",
          }),
        ) as PackageJson;
        pkgJson.exports = {
          "./package.json": "./package.json",
          ".": {
            import: "./dist/index.mjs",
            types: "./dist/index.d.ts",
          },
        };

        [...client, ...server]
          .filter((e) => e.endsWith(".tsx"))
          .forEach((entry) => {
            const file = entry.replace("./src/", "").replace(".tsx", "");
            pkgJson.exports["./" + file] = {
              import: "./dist/" + file + ".mjs",
              types: "./dist/" + file + ".d.ts",
            };
            pkgJson.typesVersions["*"][file] = ["dist/" + file + ".d.ts"];
          });

        await writeFile("./package.json", JSON.stringify(pkgJson, null, 2));
      },
    },
  ];
});

type PackageJson = {
  name: string;
  exports: Record<string, { import: string; types: string } | string>;
  typesVersions: Record<"*", Record<string, string[]>>;
  files: string[];
  dependencies: Record<string, string>;
  pnpm: {
    overrides: Record<string, string>;
  };
};
