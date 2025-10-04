import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
import unusedImports from 'eslint-plugin-unused-imports';
import github from 'eslint-plugin-github';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import-x';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs.recommended,
    prettier,
    ...svelte.configs.prettier,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
        rules: {
            // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
            // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
            'no-undef': 'off',
        },
    },
    {
        files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: ['.svelte'],
                parser: ts.parser,
                svelteConfig,
            },
        },
        plugins: {
            'unused-imports': unusedImports,
            github,
            '@stylistic': stylistic,
        },
        rules: {
            /*
             * JavaScript
             */

            // Language
            eqeqeq: 'error',
            curly: ['error', 'all'],
            'github/array-foreach': 'error',

            // Style
            '@stylistic/padding-line-between-statements': [
                'warn',
                {
                    blankLine: 'always',
                    prev: '*',
                    next: ['continue', 'return', 'break', 'block-like', 'function'],
                },
                {
                    blankLine: 'always',
                    prev: ['block-like', 'function'],
                    next: '*',
                },
                {
                    blankLine: 'always',
                    prev: ['const', 'let', 'var'],
                    next: '*',
                },
                {
                    blankLine: 'any',
                    prev: ['const', 'let', 'var'],
                    next: ['const', 'let', 'var'],
                },
            ],
            '@stylistic/lines-between-class-members': [
                'warn',
                {
                    enforce: [
                        {
                            blankLine: 'always',
                            prev: '*',
                            next: 'method',
                        },
                        {
                            blankLine: 'always',
                            prev: 'method',
                            next: '*',
                        },
                    ],
                },
            ],

            // Unused imports
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            // Import ordering
            'import-x/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                    'newlines-between': 'never',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],

            /*
             * TypeScript
             */

            // Enabled by @typescript-eslint/stylistic
            '@typescript-eslint/consistent-type-definitions': 'off',

            // Must be disabled to use unused-imports
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
);
