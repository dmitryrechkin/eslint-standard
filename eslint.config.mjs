// eslint.config.mjs
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import stylisticPlugin from '@stylistic/eslint-plugin';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import jsdocIndentPlugin from './src/plugins/jsdoc-indent.mjs';
import interfaceBracePlugin from './src/plugins/interface-brace.mjs';

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
				'@stylistic': stylisticPlugin,
				'jsdoc': jsdocPlugin,
				'simple-import-sort': simpleImportSortPlugin,
				'perfectionist': perfectionistPlugin,
				'jsdoc-indent': jsdocIndentPlugin,
				'interface-brace': interfaceBracePlugin,
				...plugins,
			},
			rules: {
				// Original @dmitryrechkin/eslint-standard rules
				'@typescript-eslint/explicit-function-return-type': 'error',
				'@typescript-eslint/no-explicit-any': 'off',

				// Original coding guidelines
				'brace-style': 'off', // Disabled in favor of @stylistic/brace-style
				'@stylistic/brace-style': ['error', 'allman', { allowSingleLine: true }],
				indent: 'off', // Disabled to avoid conflicts with @stylistic/indent and our JSDoc plugin
				'@stylistic/indent': ['error', 'tab', { SwitchCase: 1 }],
				quotes: 'off', // Disabled in favor of @stylistic/quotes
				'@stylistic/quotes': ['error', 'single'],
				semi: 'off', // Disabled in favor of @stylistic/semi
				'@stylistic/semi': ['error', 'always'],
				'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
				'no-trailing-spaces': 'off', // Disabled in favor of @stylistic/no-trailing-spaces
				'@stylistic/no-trailing-spaces': 'error',
				'eol-last': 'off', // Disabled in favor of @stylistic/eol-last
				'@stylistic/eol-last': ['error', 'always'],
				'comma-dangle': 'off', // Disabled in favor of @stylistic/comma-dangle
				'@stylistic/comma-dangle': ['error', 'never'],

				// Original naming conventions
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

				// Original unused-imports rules
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

				// Enhanced: Class member ordering with auto-fix
				'perfectionist/sort-classes': [
					'error',
					{
						type: 'natural',
						order: 'asc',
						groups: [
							'index-signature',
							'static-property',
							'property',
							'protected-property',
							'private-property',
							'constructor',
							'static-method',
							'method',
							'protected-method',
							'private-method'
						]
					}
				],

				// Enhanced: Import sorting
				'simple-import-sort/imports': 'error',
				'simple-import-sort/exports': 'error',

				// Enhanced: JSDoc formatting with proper alignment
				'jsdoc/check-indentation': 'off', // Disabled to avoid conflicts with our custom plugin
				'jsdoc/tag-lines': 'off', // Disabled to avoid conflicts with our custom plugin
				'jsdoc-indent/jsdoc-indent': ['error', { tabWidth: 4 }],

				// JSDoc requirements with type hints
				'jsdoc/require-jsdoc': ['error', {
					enableFixer: false, // Don't auto-generate empty JSDoc blocks
					require: {
						FunctionDeclaration: true,
						MethodDefinition: true,
						ClassDeclaration: true,
						ArrowFunctionExpression: true,
						FunctionExpression: true
					},
					contexts: [
						'TSInterfaceDeclaration',
						'TSTypeAliasDeclaration',
						'TSEnumDeclaration'
						// Removed 'ClassProperty' and 'PropertyDefinition' - no JSDoc required for properties
					]
				}],
				'jsdoc/require-description': 'error',
				'jsdoc/require-param': 'error',
				'jsdoc/require-param-description': 'error',
				'jsdoc/require-param-name': 'error',
				'jsdoc/require-returns': 'error',
				'jsdoc/require-returns-description': 'error',
				'jsdoc/check-param-names': 'error',
				'jsdoc/check-tag-names': 'error',
				'jsdoc/check-types': 'error',
				'jsdoc/valid-types': 'error',
				'jsdoc/no-undefined-types': 'error',
				'jsdoc/require-yields': 'error',
				'jsdoc/require-throws': 'error',
				'jsdoc/check-alignment': 'off', // Handled by custom plugin
				'jsdoc/multiline-blocks': ['error', {
					noMultilineBlocks: false,
					minimumLengthForMultiline: 40
				}],

				// JSDoc with type hints requirements
				'jsdoc/require-param-type': 'error', // Require type hints for parameters
				'jsdoc/require-returns-type': 'error', // Require type hints for returns
				'jsdoc/no-types': 'off', // Allow type annotations in JSDoc
				'jsdoc/check-types': 'error', // Ensure valid JSDoc types
				'jsdoc/valid-types': 'error', // Validate type syntax
				
				// Enhanced: Interface brace style
				'interface-brace/interface-brace-style': 'error',

				// Allow custom rules to be added
				...rules,
			},
		},
	];
}