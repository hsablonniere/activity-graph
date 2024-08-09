import pluginJs from '@eslint/js';

export default [
  pluginJs.configs.recommended,
  {
    rules: {
      // TypeScript handles this
      'no-undef': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
