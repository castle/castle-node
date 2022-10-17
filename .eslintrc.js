module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2015, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'prefer-arrow'],
  rules: {
    'no-bitwise': ['off'],
    '@typescript-eslint/no-empty': ['off'],
    '@typescript-eslint/no-empty-function': ['off'],
    '@typescript-eslint/no-unused-vars': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/no-var-requires': ['off'],
    'prefer-rest-params': ['off'],
    'sort-keys': ['off'],
    'no-this-alias': ['off'],
    'import/no-default-export': ['error'],
    'one-variable-per-declaration': ['off'],
    'prefer-object-spread': ['off'],
    'prefer-spread': ['off'],
  },
};
