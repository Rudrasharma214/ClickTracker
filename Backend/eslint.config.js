import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
    {
        ignores: ['node_modules', 'dist', 'build', '.env*', '*.log', '.DS_Store'],
    },
    {
        files: ['src/**/*.{js,mjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
            },
        },
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...prettier.rules,
            'no-console': 'warn',
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                },
            ],
            'prettier/prettier': 'error',
        },
    },
];