const { FlatCompat } = require('@eslint/eslintrc');
const compat = new FlatCompat();

module.exports = [
  {
    languageOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 2015, // Allows for the parsing of modern ECMAScript features
      sourceType: 'module', // Allows for the use of imports
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      prettier: require('eslint-plugin-prettier'),
      import: require('eslint-plugin-import'),
      'prefer-arrow': require('eslint-plugin-prefer-arrow'),
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
];
