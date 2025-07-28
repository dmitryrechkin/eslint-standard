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
				'@typescript-eslint/no-explicit-any': 'error', // Ban 'any' type for type safety

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

				// Code Complexity Rules (industry standards)
				'complexity': ['error', 10], // Cyclomatic complexity - max 10 paths through a function
				'max-lines-per-function': ['error', {
					max: 100,
					skipBlankLines: true,
					skipComments: true,
					IIFEs: true
				}],
				'max-statements': ['error', 20], // Max 20 statements per function
				'max-params': ['error', 4], // Max 4 parameters per function
				'max-depth': ['error', { max: 3 }], // Max 3 levels of block nesting
				'max-nested-callbacks': ['error', 3], // Max 3 levels of callback nesting
				'max-lines': ['warn', {
					max: 300,
					skipBlankLines: true,
					skipComments: true
				}],
				'max-len': ['error', {
					code: 120,
					tabWidth: 4,
					ignoreUrls: true,
					ignoreStrings: true,
					ignoreTemplateLiterals: true,
					ignoreRegExpLiterals: true,
					ignoreComments: true
				}],
				'max-statements-per-line': ['error', { max: 1 }],
				'@typescript-eslint/max-params': ['error', { max: 4 }], // TypeScript-aware version
				'no-else-return': ['error', { allowElseIf: false }], // Encourage early returns
				'no-lonely-if': 'error', // Avoid single if in else block
				'no-nested-ternary': 'error', // Avoid complex ternary operators
				'@typescript-eslint/no-misused-promises': 'error', // Interface segregation
				'@typescript-eslint/prefer-readonly': 'error', // Immutability
				'@typescript-eslint/explicit-member-accessibility': ['error', {
					accessibility: 'explicit',
					overrides: {
						constructors: 'no-public'
					}
				}], // Clear interface contracts

				// Additional pragmatic safety rules
				'curly': ['error', 'all'], // Always use curly braces
				'eqeqeq': ['error', 'always'], // Use === and !==
				'no-var': 'error', // Use let/const instead
				'prefer-const': 'error', // Use const for unchanged variables
				'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn on console.log
				'@typescript-eslint/no-floating-promises': 'error', // Await or handle promises
				'@typescript-eslint/await-thenable': 'error', // Only await promises
				'no-return-await': 'off', // Actually useful for stack traces
				
				// Array safety
				'@typescript-eslint/no-array-delete': 'error', // Use splice, not delete
				'array-callback-return': 'error', // Ensure array methods return values
				
				// Error handling
				'@typescript-eslint/only-throw-error': 'error', // Only throw Error objects
				'no-empty': ['error', { allowEmptyCatch: false }], // No empty blocks
				'no-fallthrough': 'error', // Prevent switch case fallthrough
				
				// Null/undefined safety
				'@typescript-eslint/no-unnecessary-condition': 'warn', // Catch always-truthy/falsy
				'no-unsafe-optional-chaining': 'error', // Prevent ?. errors
				
				// Function safety
				'require-await': 'error', // Async functions must use await
				'no-async-promise-executor': 'error', // No async in Promise constructor
				'@typescript-eslint/no-misused-promises': 'error', // Correct promise usage
				
				// Variable safety
				'no-shadow': 'off', // Turn off base rule
				'@typescript-eslint/no-shadow': 'error', // No variable shadowing
				'no-use-before-define': 'off', // Turn off base rule
				'@typescript-eslint/no-use-before-define': 'error', // Define before use
				'no-param-reassign': ['error', { props: false }], // Don't reassign parameters (but allow property mutation)
				
				// Loop safety
				'for-direction': 'error', // Prevent infinite loops
				'no-unmodified-loop-condition': 'error', // Loop conditions must change
				'no-await-in-loop': 'warn', // Warn on await in loops
				
				// Security basics
				'no-eval': 'error', // No eval()
				'no-implied-eval': 'error', // No setTimeout(string)
				'no-new-func': 'error', // No new Function()
				
				// Maintainability
				'no-duplicate-imports': 'error', // One import per module
				'@typescript-eslint/no-duplicate-enum-values': 'error', // Unique enum values
				'no-unreachable': 'error', // No code after return/throw
				'no-unused-expressions': ['error', { 
					allowShortCircuit: true, // Allow && and || for control flow
					allowTernary: true, // Allow ternary for side effects
					allowTaggedTemplates: true // Allow tagged templates
				}], // No side-effect free expressions
				
				// Common bug prevention
				'no-cond-assign': 'error', // No assignment in conditions
				'no-constant-condition': 'error', // No constant conditions in if/while
				'no-debugger': 'error', // No debugger statements
				'no-dupe-keys': 'error', // No duplicate object keys
				'no-dupe-args': 'error', // No duplicate function arguments
				'no-irregular-whitespace': 'error', // No weird whitespace
				'valid-typeof': 'error', // Typeof comparisons must be valid
				'@typescript-eslint/no-unnecessary-type-assertion': 'error', // No redundant type assertions
				
				// Number safety
				'no-loss-of-precision': 'error', // Prevent precision loss
				'no-compare-neg-zero': 'error', // Use Object.is for -0
				'use-isnan': 'error', // Use isNaN() for NaN checks
				'no-magic-numbers': ['warn', { 
					ignore: [0, 1, -1, 2, 10, 100, 1000, // Common multipliers
						60, 24, 365, // Time calculations
						200, 204, 301, 302, 400, 401, 403, 404, 500, 502, 503], // HTTP codes
					ignoreArrayIndexes: true,
					ignoreDefaultValues: true,
					enforceConst: true,
					ignoreClassFieldInitialValues: true
				}], // Named constants for magic numbers
				
				// Allow custom rules to be added
				...rules,
			},
		},
	];
}