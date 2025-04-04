import type { CodegenConfig } from "@graphql-codegen/cli";

const plugins = [
  "typescript",
  "typescript-operations",
  "named-operations-object",
  "typed-document-node",
];

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    "http://localhost:5000/graphql": {
      // If your backend is protected, add headers here
      // headers: {
      //   Authorization: "Bearer YOUR_TOKEN",
      // },
    },
  },
  documents: "src/**/*.{ts,tsx}",
  generates: {
    "./src/graphql/__generated__/types.ts": {
      plugins,
      config: {
        useTypeImports: true, // Uses `import type` instead of `import`
        strictScalars: true, // Ensures strict typing for scalars
        dedupeFragments: true, // Avoids duplicate fragments
        scalars: {
          DateTime: "string",
        },
      },
    },
  },
};

export default config;
