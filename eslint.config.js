import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import astro from "eslint-plugin-astro";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  // Base configuration for all files
  js.configs.recommended,

  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      "dist/",
      ".astro/",
      "node_modules/",
      ".env*",
      "*.log",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      ".vscode/",
      ".idea/",
      ".DS_Store",
      "Thumbs.db",
      "public/",
      "*.min.js",
      "*.min.css",
    ],
  },

  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        Request: "readonly",
        Response: "readonly",
        Headers: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        AbortController: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        HTMLElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLTextAreaElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLParagraphElement: "readonly",
        HTMLHeadingElement: "readonly",
        HTMLSpanElement: "readonly",
        RequestInit: "readonly",
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react: react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],

      // React specific rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unknown-property": [
        "error",
        { ignore: ["cmdk-input-wrapper"] },
      ],

      // General ESLint rules
      "no-console": "warn",
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-unused-vars": "off", // Disabled in favor of TypeScript version
      "prefer-const": "error",
      "no-var": "error",
      "no-empty": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],

      // Semicolon rules
      semi: ["error", "always"],

      // Accessibility
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/heading-has-content": ["error", { components: [""] }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Astro files
  ...astro.configs.recommended,
  {
    files: ["**/*.astro"],
    rules: {
      // Disable unused vars rules for Astro files (components may have props that appear unused)
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
    },
  },

  // Configuration files (only JS config files exist)
  {
    files: ["*.config.{js,mjs}", "tailwind.config.js", "astro.config.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "no-console": "off", // Allow console in config files
    },
  },
];
