// ESLint v9 flat config (ESM — project is "type": "module").
// `--ext` is gone in flat config; file globs below decide what gets linted.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        // Never lint build output, reports, deps, or generated artifacts.
        ignores: [
            'dist/**',
            'node_modules/**',
            'playwright-report/**',
            'test-results/**',
            'allure-results/**',
            'allure-report/**',
            'tta-report/**',
            'logs/**',
            'coverage/**',
            '**/*.original.md',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.node },
        },
        rules: {
            // Underscore-prefixed args/vars are intentional throwaways.
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
            ],
        },
    },
    // Turn off any stylistic rules that would fight Prettier. Keep last.
    prettier,
);
