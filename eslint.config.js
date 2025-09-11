// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import unused from "eslint-plugin-unused-imports";

export default [
  { ignores: ["dist/**", "node_modules/**"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      globals: { ...globals.browser, ...globals.es2021 },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
      "unused-imports": unused,
    },

    /** 👇 Add this */
    settings: {
      react: { version: "detect" },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        /** uses `eslint-import-resolver-typescript` */
        typescript: {
          alwaysTryTypes: true,
          // include whichever tsconfigs you actually use
          project: ["./tsconfig.app.json", "./tsconfig.node.json", "./tsconfig.json"],
        },
        /** fallback to Node resolution */
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "unused-imports/no-unused-imports": "warn",
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: [["builtin", "external"], ["internal"], ["parent", "sibling", "index"]],
          pathGroups: [{ pattern: "@/**", group: "internal", position: "before" }],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
    },
  },
];
