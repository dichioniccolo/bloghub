import type { PlopTypes } from "@turbo/gen";
import { execSync } from "node:child_process";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("init", {
    description: "Generate a new package for the Acme Monorepo",
    prompts: [
      {
        type: "input",
        name: "name",
        message:
          "What is the name of the package? (You can skip the `@acme/` prefix)",
      },
      {
        type: "input",
        name: "deps",
        message:
          "Enter a space separated list of dependencies you would like to install",
      },
    ],
    actions: [
      (answers) => {
        if ("name" in answers && typeof answers.name === "string") {
          if (answers.name.startsWith("@acme/")) {
            answers.name = answers.name.replace("@acme/", "");
          }
        }
        return "Config sanitized";
      },
      {
        type: "add",
        path: "packages/{{ name }}/package.json",
        templateFile: "templates/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/tsconfig.json",
        templateFile: "templates/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/src/index.ts",
        template: "export const name = '{{ name }}';",
      },
      {
        type: "modify",
        path: "packages/{{ name }}/package.json",
        async transform(content, answers) {
          const pkg = JSON.parse(content);
          for (let dep of answers.deps.split(" ").filter(Boolean)) {
            // dep can be "react" or "@acme/api" or "acme/api" or "acme/api@latest" or "@acme/api@latest"
            // if there is @ at the beginning of the line, it is the name of the package
            // if there is a @ in the middle of the line, it is the version of the package

            let version;

            if (dep.startsWith("@")) {
              version = await fetch(
                `https://registry.npmjs.org/-/package/${dep}/dist-tags`,
              )
                .then((res) => res.json())
                .then((json) => json.latest);
            }

            if (dep.includes("@") && !dep.startsWith("@")) {
              version = dep.split("@")[1];
              dep = dep.split("@")[0];
            }

            pkg.dependencies![dep] = `^${version}`;
          }
          return JSON.stringify(pkg, null, 2);
        },
      },
      async (answers) => {
        /**
         * Install deps and format everything
         */
        // execSync("bun manypkg fix", {
        //   stdio: "inherit",
        // });
        execSync(
          `bun prettier --write packages/${
            (answers as { name: string }).name
          }/** --list-different`,
        );
        return "Package scaffolded";
      },
    ],
  });
}
