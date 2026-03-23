import eslintStandardConfig from '../eslint.config.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default eslintStandardConfig({
	files: ['tests/**/*.ts'],
	ignores: [],
	tsconfigPath: resolve(__dirname, './tsconfig.json'),
	rules: {
		// Disable problematic rule that doesn't work with flat config for imports
		'import-x/no-unused-modules': 'off'
	}
});