import eslintStandardConfig from '../eslint.config.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseConfig = eslintStandardConfig({
	strict: true,
	tsconfigPath: resolve(__dirname, './tsconfig.json')
});

// Add overrides to ignore noise rules in test files
const overrides = {
	files: ['**/*.ts'],
	rules: {
		'jsdoc/require-jsdoc': 'off',
		'standard-conventions/folder-camel-case': 'off',
		'standard-conventions/function-name-match-filename': 'off',
		'unicorn/filename-case': 'off',
		'prettier/prettier': 'off',
		'id-length': 'off',
		'max-statements-per-line': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'unused-imports/no-unused-vars': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/prefer-readonly': 'off',
		'perfectionist/sort-classes': 'off',
		'require-await': 'off',
		'unicorn/no-useless-promise-resolve-reject': 'off',
		'@typescript-eslint/no-useless-constructor': 'off',
		'standard-conventions/class-location': 'off',
		'standard-conventions/no-constants-in-class-files': 'off',
		'standard-conventions/one-class-per-file': 'off',
		'@stylistic/lines-between-class-members': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'import-x/no-extraneous-dependencies': 'off',
		'import-x/newline-after-import': 'off',
		'@stylistic/padding-line-between-statements': 'off',
		'import-x/no-unresolved': 'off',
		'no-magic-numbers': 'off',

		// Explicitly re-enable strict rules that might have been turned off by overrides
		'standard-conventions/interface-naming': 'error',
		'standard-conventions/explicit-return-type': 'error',
		'standard-conventions/no-direct-instantiation': 'error',
		'standard-conventions/prefer-enums': 'error',
		'standard-conventions/schema-naming': 'error',
		'standard-conventions/factory-single-public-method': 'error',
		'standard-conventions/service-single-public-method': 'error',
		'standard-conventions/no-static-in-non-helpers': 'error',
		'standard-conventions/repository-by-id': 'error',
		'standard-conventions/no-utils-folder': 'error'
	}
};

export default [
	...baseConfig,
	overrides
];
