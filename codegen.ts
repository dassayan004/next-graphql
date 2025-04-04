import type { CodegenConfig } from "@graphql-codegen/cli";

const plugins = [
  "typescript",
  "typescript-operations",
  "named-operations-object",
  "typed-document-node",
];

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:5000/graphql",
  documents: "src/**/*.{ts,tsx}",
  generates: {
    "./src/graphql/__generated__/types.ts": {
      plugins,
    },
  },
};

export default config;
