module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
    mocha: true,
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    semi: ['error', 'always'],
    'space-before-function-paren': 'off'
  },
  overrides: [
    {
      files: ['*.test.ts'],
      rules: {
        'no-unused-expressions': 'off'
      }
    },
    {
      files: ['src/entities/*.ts'],
      rules: {
        camelcase: 'off'
      }
    }
  ]
};
