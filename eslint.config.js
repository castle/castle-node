import { defineConfig } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import preferArrowPlugin from 'eslint-plugin-prefer-arrow';

const compat = new FlatCompat();

// eslint-disable-next-line import/no-default-export
export default defineConfig([
  {
    languageOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 2015,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
      'prefer-arrow': preferArrowPlugin,
    },
  },
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    rules: {
      'no-bitwise': 'off',
      '@typescript-eslint/no-empty': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'prefer-rest-params': 'off',
      'sort-keys': 'off',
      'no-this-alias': 'off',
      'import/no-default-export': 'error',
      'one-variable-per-declaration': 'off',
      'prefer-object-spread': 'off',
      'prefer-spread': 'off',
    },
  },
]);
