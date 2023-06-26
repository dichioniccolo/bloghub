/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: [
    "@bloghub/eslint-config/base",
    "@bloghub/eslint-config/nextjs",
    "@bloghub/eslint-config/react",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
};

module.exports = config;
