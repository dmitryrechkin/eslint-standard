import eslintStandardConfig from '../eslint.config.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseConfig = eslintStandardConfig({
	tsconfigPath: resolve(__dirname, './tsconfig.naming.json')
});

// Test config with naming conventions ENABLED
const testConfig = [
	...baseConfig,
	{
		files: ['naming-conventions-temp/**/*.ts'],
		rules: {
			// Disable noise rules for cleaner test output
			'jsdoc/require-jsdoc': 'off',
			'standard-conventions/folder-camel-case': 'off',
			'standard-conventions/function-name-match-filename': 'off',
			'unicorn/filename-case': 'off',
			'prettier/prettier': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'unused-imports/no-unused-vars': 'off',

			// EXPLICITLY ENABLE naming-convention (this tests the rule we fixed)
			'@typescript-eslint/naming-convention': 'warn'
		}
	}
];

export default testConfig;
