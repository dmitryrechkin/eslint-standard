import eslintStandardConfig from '../eslint.config.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default eslintStandardConfig({
	strict: false,
	tsconfigPath: resolve(__dirname, './tsconfig.json')
});
