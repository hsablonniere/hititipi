import pluginJs from '@eslint/js';

export default [
  {
    ignores: ['public/**/*'],
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      // TypeScript handles this
      'no-undef': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
