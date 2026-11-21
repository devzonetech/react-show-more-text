import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: [
            ".idea/**",
            ".nyc_output/**",
            "lib/**",
            "node_modules/**",
            "example/*",
            "!example/vite.config.ts",
            "example-next/**",
            "*.log",
            "nbproject/private/**",
            "storybook-static/**",
            "dist/**",
            "coverage/**",
            ".vitest/**",
        ],
    },
    {
        files: ["src/**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    // Core no-unused-vars does not count JSX references as variable usage.
                    varsIgnorePattern: "^[A-Z]",
                },
            ],
            "prefer-const": "error",
        },
    },
];
