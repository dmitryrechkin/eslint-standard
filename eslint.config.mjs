// eslint.config.mjs
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export default [
	{
		ignores: ['node_modules/**', 'dist/**'],
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			'unused-imports': unusedImportsPlugin,
		},
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'error',
			//'linebreak-style': 'off', // Disable linebreak style rule
			'@typescript-eslint/no-explicit-any': 'off', // Turn off the rule for no-explicit-any

			/// coding guidelines
			'brace-style': ['error', 'allman', { allowSingleLine: true }], // Use Allman style for braces
			indent: ['error', 'tab', { SwitchCase: 1 }],
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'no-trailing-spaces': 'error',
			'eol-last': ['error', 'always'],
			'comma-dangle': ['error', 'never'],

			// naming conventions
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variableLike',
					format: ['camelCase'],
					leadingUnderscore: 'forbid',
				},
				{
					selector: 'function',
					format: ['camelCase'],
					leadingUnderscore: 'forbid',
				},
				{
					selector: 'class',
					format: ['PascalCase'],
					leadingUnderscore: 'forbid',
				},
				{
					selector: 'parameter',
					format: ['camelCase'],
					leadingUnderscore: 'forbid',
				},
				{
					selector: 'memberLike',
					format: ['camelCase'],
					leadingUnderscore: 'forbid',
				},
			],

			// unused-imports rules
			'unused-imports/no-unused-imports-ts': 'error',
			'unused-imports/no-unused-vars-ts': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
		},
	},
];