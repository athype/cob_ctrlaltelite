import pluginJs from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import globals from 'globals';
import { configs as tsConfigs } from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.node } },
    { ignores: ['node_modules', 'dist'] },
    pluginJs.configs.recommended,
    ...tsConfigs.recommended,
    pluginImport.flatConfigs.recommended,
    pluginImport.flatConfigs.typescript,
    {
        settings: {
            'import/resolver': {
                'typescript': true,
                'node': true,
            },
        },
        rules: {
            'quotes': ['error', 'single'],
            'indent': ['error', 4],
            'semi': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            '@typescript-eslint/explicit-function-return-type': ['error'],
            'import/order': [
                'error',
                {
                    'groups': [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
                    'newlines-between': 'always',
                    'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
                },
            ],
        },
    },
];