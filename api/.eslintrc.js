module.exports = {
    env: {
      node: true, // Add this line
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: [
      'react',
    ],
    rules: {
      // Your custom rules here
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the react version
      },
    },
  };
  