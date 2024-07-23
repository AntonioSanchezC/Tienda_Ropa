module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true, // Actualizado a ES2021
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 2021, // Actualizado a ES2021
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '18.3', // Actualiza a la versión específica de React que estás utilizando
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Otras reglas personalizadas según sea necesario
  },
};
