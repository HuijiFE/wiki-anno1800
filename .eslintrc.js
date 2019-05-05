module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['@huiji/typescript'],
  rules: {
    'class-methods-use-this': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'off',
      {
        ignoreRestSiblings: true,
        args: 'none',
        caughtErrors: 'none',
      },
    ],
  },
};
