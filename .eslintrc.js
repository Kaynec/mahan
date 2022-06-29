module.exports = {
  sourceType: 'module',
  root: true,
  env: {
    node: true
  },
  extends: [],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    'no-empty': 0,
    'no-empty-function': 0,
    '@typescript-eslint/no-this-alias': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ]
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};
