import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 80,
  endOfLine: 'lf',
  tailwindStylesheet: path.join(__dirname, 'src/styles.css'),
  plugins: ['prettier-plugin-tailwindcss'],
};
