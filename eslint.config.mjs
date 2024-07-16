// eslint.config.mjs
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export default function ({
	tsconfigPath = './tsconfig.json',
	ignores = [],
	files = [],
	plugins = {},
	rules = {}
} = {}) {
	return [
		{
			ignores: ['node_modules/**', 'dist/**', ...ignores],
		},
		{
			files: ['**/*.{js,jsx,ts,tsx}', ...files],
			languageOptions: {
				parser: tsParser,
				parserOptions: {
					ecmaVersion: 2020,
					sourceType: 'module',
					project: tsconfigPath,
				},
			},
			plugins: {
				'@typescript-eslint': tsPlugin,
				'unused-imports': unusedImportsPlugin,
				...plugins,
			},
			rules: {
				'@typescript-eslint/explicit-function-return-type': 'error',
				'@typescript-eslint/no-explicit-any': 'off', // Turn off the rule for no-explicit-any

				// coding guidelines
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
						custom: {
							regex: '^_',
							match: false,
						},
					},
					{
						selector: 'parameter',
						format: null,
						leadingUnderscore: 'require',
						modifiers: ['unused'],
					},
					{
						selector: 'memberLike',
						format: ['camelCase'],
						leadingUnderscore: 'forbid',
					},
					{
						selector: 'property',
						modifiers: ['readonly'],
						format: ['camelCase', 'UPPER_CASE'],
						leadingUnderscore: 'forbid',
					},
					{
						selector: 'enumMember',
						format: ['UPPER_CASE'],
						leadingUnderscore: 'forbid',
					},
				],

				// unused-imports rules
				'unused-imports/no-unused-imports': 'error',
				'unused-imports/no-unused-vars': [
					'warn',
					{
						vars: 'all',
						varsIgnorePattern: '^_',
						args: 'after-used',
						argsIgnorePattern: '^_',
					},
				],
				...rules,
			},
		},
	];
}