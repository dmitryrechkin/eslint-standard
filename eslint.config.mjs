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
import switchCaseBracePlugin from './src/plugins/switch-case-brace.mjs';
import securityPlugin from 'eslint-plugin-security';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import promisePlugin from 'eslint-plugin-promise';
import importPlugin from 'eslint-plugin-import';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import unicornPlugin from 'eslint-plugin-unicorn';
import noSecretsPlugin from 'eslint-plugin-no-secrets';
import regexpPlugin from 'eslint-plugin-regexp';
import functionalPlugin from 'eslint-plugin-functional';
// eslint-disable-next-line import/no-extraneous-dependencies
import prettierConfig from 'eslint-config-prettier';
// eslint-disable-next-line import/no-extraneous-dependencies
import prettierPlugin from 'eslint-plugin-prettier';
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
		// Add Prettier integration
		prettierConfig,
		{
			files: ['**/*.{js,ts}', ...files], // Exclude jsx, tsx, and astro files from main config
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
				'switch-case-brace': switchCaseBracePlugin,
				'security': securityPlugin,
				'jsx-a11y': jsxA11yPlugin,
				'promise': promisePlugin,
				'import': importPlugin,
				'sonarjs': sonarjsPlugin,
				'unicorn': unicornPlugin,
				'no-secrets': noSecretsPlugin,
				'regexp': regexpPlugin,
				'functional': functionalPlugin,
				'prettier': prettierPlugin,
				...plugins,
			},
			settings: {
				'import/resolver': {
					node: {
						extensions: ['.js', '.jsx', '.ts', '.tsx'],
					},
				},
				'import/parsers': {
					'@typescript-eslint/parser': ['.ts', '.tsx'],
				},
				'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
			},
			rules: {
				// Prettier integration
				'prettier/prettier': 'error',
				// Disable rules that conflict with prettier
				'switch-case-brace/switch-case-brace-style': 'off',
				
				// Original @dmitryrechkin/eslint-standard rules
				'@typescript-eslint/explicit-function-return-type': 'error',
				'@typescript-eslint/no-explicit-any': 'error', // Ban 'any' type for type safety

				// Original coding guidelines - formatting rules disabled in favor of prettier
				'brace-style': 'off', // Handled by prettier-plugin-brace-style
				'@stylistic/brace-style': 'off', // Handled by prettier-plugin-brace-style
				'@stylistic/block-spacing': 'off', // Handled by prettier
				indent: 'off', // Handled by prettier (useTabs: true, tabWidth: 4)
				'@stylistic/indent': 'off', // Handled by prettier (useTabs: true, tabWidth: 4)
				quotes: 'off', // Handled by prettier (singleQuote: true)
				'@stylistic/quotes': 'off', // Handled by prettier (singleQuote: true)
				semi: 'off', // Handled by prettier (semi: true)
				'@stylistic/semi': 'off', // Handled by prettier (semi: true)
				'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
				'no-trailing-spaces': 'off', // Handled by prettier
				'@stylistic/no-trailing-spaces': 'off', // Handled by prettier
				'eol-last': 'off', // Handled by prettier
				'@stylistic/eol-last': 'off', // Handled by prettier
				'comma-dangle': 'off', // Handled by prettier (trailingComma: 'none')
				'@stylistic/comma-dangle': 'off', // Handled by prettier (trailingComma: 'none')

				// Comprehensive naming conventions based on coding standards

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
				
				// Enhanced: Switch case brace style - Allman style for case blocks
				'switch-case-brace/switch-case-brace-style': 'error',

				// Additional naming conventions based on coding standards
				'@typescript-eslint/naming-convention': [
					'warn',
					// Existing rules remain the same...
					{
						selector: 'variableLike',
						format: ['camelCase'],
						leadingUnderscore: 'forbid',
					},
					{
						selector: 'variable',
						modifiers: ['const'],
						format: ['camelCase', 'UPPER_CASE'],
						leadingUnderscore: 'forbid',
					},
					{
						selector: 'variable',
						format: ['camelCase'],
						leadingUnderscore: 'forbid'
						// Removed overly restrictive generic name restrictions - allow result, config, data, etc.
					},
					{
						selector: 'function',
						format: ['camelCase'],
						leadingUnderscore: 'forbid'
						// Removed overly restrictive verb restrictions - allow common function names
					},
					{
						selector: 'method',
						format: ['camelCase'],
						leadingUnderscore: 'forbid',
						custom: {
							regex: '^(create|make|get|set|update|delete|remove|add|init|load|save|fetch|find|search|check|validate|handle|process|execute|run|start|stop|open|close|read|write|parse|format|convert|transform|build|render|draw|calculate|compute|generate|send|receive|submit|cancel|reset|clear|test|log|debug|trace|info|warn|error|show|hide|enable|disable|toggle|select|click|focus|blur|scroll|resize|move|copy|paste|cut|undo|redo|forward|back|up|down|left|right|first|last|next|prev|push|pop|shift|unshift|splice|slice|concat|join|split|replace|trim|pad|truncate|wrap|unwrap|escape|unescape|encode|decode|encrypt|decrypt|compress|decompress|serialize|deserialize|clone|merge|extend|assign|bind|unbind|on|off|once|emit|trigger|listen|unlisten|subscribe|unsubscribe|publish|unpublish|attach|detach|append|prepend|insert|inject|extract|filter|map|reduce|forEach|some|every|find|findIndex|indexOf|lastIndexOf|includes|contains|has|is|equals|compare|match|test|verify|assert|ensure|require|expect|should|must|can|may|might|will|shall|would|could)$',
							match: false
						}
					},
					{
						selector: 'method',
						modifiers: ['public'],
						format: ['camelCase'],
						leadingUnderscore: 'forbid'
						// Allow generic names for public methods
					},
					// Services must end with 'Service'
					{
						selector: 'class',
						filter: {
							regex: 'Service$',
							match: true
						},
						format: ['PascalCase'],
						custom: {
							regex: '^[A-Z][a-zA-Z]*Service$',
							match: true
						}
					},
					// Repositories must end with 'Repository'
					{
						selector: 'class',
						filter: {
							regex: 'Repository$',
							match: true
						},
						format: ['PascalCase'],
						custom: {
							regex: '^[A-Z][a-zA-Z]*(Command|Query)?Repository$',
							match: true
						}
					},
					// Helpers must end with 'Helper'
					{
						selector: 'class',
						filter: {
							regex: 'Helper$',
							match: true
						},
						format: ['PascalCase'],
						custom: {
							regex: '^[A-Z][a-zA-Z]*Helper$',
							match: true
						}
					},
					// Factories must end with 'Factory'
					{
						selector: 'class',
						filter: {
							regex: 'Factory$',
							match: true
						},
						format: ['PascalCase'],
						custom: {
							regex: '^[A-Z][a-zA-Z]*Factory$',
							match: true
						}
					},
					// General class naming (excluding specific patterns above)
					{
						selector: 'class',
						format: ['PascalCase'],
						leadingUnderscore: 'forbid',
						custom: {
							regex: '^(Base|Abstract|Main|App|Application|Component|Element|Item|Object|Entity|Model|View|Controller|Service|Manager|Handler|Helper|Util|Utils|Factory|Builder|Provider|Container|Wrapper|Adapter|Proxy|Decorator|Observer|Listener|Event|Action|Command|Request|Response|Result|Error|Exception|Interface|Type|Class|Struct|Enum|Module|Package|Library|Framework|System|Core|Common|Shared|Global|Default|Generic|Simple|Basic|Standard|Custom|Internal|External|Public|Private|Static|Dynamic|Singleton|Instance|Collection|List|Array|Map|Set|Dictionary|Queue|Stack|Tree|Graph|Node|Edge|Link|Data|Info|Config|Settings|Options|Parameters|Arguments|Properties|Attributes|State|Status|Context|Environment|Session|Transaction|Process|Thread|Task|Job|Worker|Pool|Cache|Buffer|Stream|Channel|Connection|Client|Server|Database|Repository|Store|Resource|Asset|File|Folder|Directory|Path|Route|Endpoint|Api|Rest|Http|Https|Tcp|Udp|Socket|Port|Host|Domain|Url|Uri|Query|Param|Header|Body|Content|Message|Packet|Frame|Byte|Bit|Flag|Token|Key|Value|Pair|Entry|Record|Row|Column|Field|Cell|Table|Index|Page|Form|Input|Output|Button|Label|Text|Image|Icon|Media|Audio|Video|Document|Template|Layout|Style|Theme|Color|Font|Size|Position|Location|Coordinate|Point|Vector|Matrix|Shape|Line|Circle|Rectangle|Polygon|Curve|Surface|Volume|Space|Time|Date|Duration|Period|Interval|Range|Sequence|Series|Pattern|Format|Encoder|Decoder|Parser|Formatter|Validator|Converter|Transformer|Filter|Mapper|Reducer|Sorter|Comparator|Iterator|Generator|Consumer|Producer|Publisher|Subscriber|Emitter|Receiver|Sender|Dispatcher|Router|Gateway|Bridge|Tunnel|Pipeline|Chain|Link|Hook|Plugin|Extension|Addon|Feature|Capability|Function|Method|Procedure|Routine|Algorithm|Strategy|Policy|Rule|Constraint|Condition|Requirement|Specification|Definition|Declaration|Implementation|Execution|Operation|Instruction|Statement|Expression|Variable|Constant|Parameter|Argument|Return|Result|Output|Input|IO|UI|GUI|CLI|API|SDK|IDE|OS|VM|CPU|GPU|RAM|ROM|HDD|SSD|DB|SQL|NoSQL|ORM|ODM|DTO|DAO|POJO|POCO|VO|BO|DO|PO|TO|SO|MO|NO)$',
							match: false
						}
					},
					{
						selector: 'interface',
						format: ['PascalCase'],
						leadingUnderscore: 'forbid',
						custom: {
							regex: '(^Type[A-Z]|Interface$)',
							match: true
						}
					},
					{
						selector: 'typeAlias',
						format: ['PascalCase'],
						leadingUnderscore: 'forbid',
						custom: {
							regex: '^Type[A-Z]',
							match: true
						}
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
						selector: 'objectLiteralProperty',
						format: ['camelCase', 'UPPER_CASE'],
						leadingUnderscore: 'forbid',
					},
					{
						selector: 'enumMember',
						format: ['camelCase', 'UPPER_CASE'],
						leadingUnderscore: 'forbid',
					},
					// Schema table files must end with 'Table'
					{
						selector: 'variable',
						filter: {
							regex: 'Table$',
							match: true
						},
						format: ['camelCase'],
						custom: {
							regex: '[a-z][a-zA-Z]*Table$',
							match: true
						}
					}
				],

				// Code Complexity Rules (industry standards)
				'complexity': ['error', 10], // Cyclomatic complexity - max 10 paths through a function
				'max-lines-per-function': ['error', {
					max: 100,
					skipBlankLines: true,
					skipComments: true,
					IIFEs: true
				}],
				'max-statements': ['error', 20], // Max 20 statements per function
				'max-params': ['error', 7], // Max 7 parameters per function
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
				'@typescript-eslint/max-params': ['error', { max: 7 }], // TypeScript-aware version
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
				
				// Identifier length rules
				'id-length': ['warn', {
					min: 3,
					exceptions: ['i', 'j', 'k', 'x', 'y', 'z', 'id', 'db', 'fs', 'os', 'io', 'ui', 'vm', '_', 'idx'],
					properties: 'never' // Don't apply to object properties
				}],
				
				// Security plugin rules
				'security/detect-eval-with-expression': 'error',
				'security/detect-non-literal-fs-filename': 'warn',
				'security/detect-non-literal-regexp': 'warn',
				'security/detect-unsafe-regex': 'error',
				'security/detect-buffer-noassert': 'error',
				'security/detect-child-process': 'warn',
				'security/detect-disable-mustache-escape': 'error',
				'security/detect-no-csrf-before-method-override': 'error',
				'security/detect-object-injection': 'off', // Too many false positives with TypeScript enums
				'security/detect-possible-timing-attacks': 'warn',
				'security/detect-pseudoRandomBytes': 'error',
				
				// Promise plugin rules
				'promise/always-return': 'error',
				'promise/no-return-wrap': 'error',
				'promise/param-names': 'error',
				'promise/catch-or-return': 'error',
				'promise/no-native': 'off',
				'promise/no-nesting': 'warn',
				'promise/no-promise-in-callback': 'warn',
				'promise/no-callback-in-promise': 'warn',
				'promise/avoid-new': 'off',
				'promise/no-new-statics': 'error',
				'promise/no-return-in-finally': 'error',
				'promise/valid-params': 'error',
				'promise/prefer-await-to-then': 'warn',
				'promise/prefer-await-to-callbacks': 'warn',
				
				// Import plugin rules
				'import/no-unresolved': 'off', // Too many false positives with TypeScript
				'import/named': 'error',
				'import/default': 'error',
				'import/namespace': 'error',
				'import/no-restricted-paths': 'off',
				'import/no-absolute-path': 'error',
				'import/no-dynamic-require': 'error',
				'import/no-internal-modules': 'off',
				'import/no-webpack-loader-syntax': 'error',
				'import/no-self-import': 'error',
				'import/no-cycle': ['error', { maxDepth: 3 }],
				'import/no-useless-path-segments': 'error',
				'import/no-relative-parent-imports': 'off',
				'import/export': 'error',
				'import/no-named-as-default': 'error',
				'import/no-named-as-default-member': 'error',
				'import/no-deprecated': 'warn',
				'import/no-extraneous-dependencies': ['error', {
					devDependencies: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}', '**/test/**', '**/tests/**', '**/__tests__/**']
				}],
				'import/no-mutable-exports': 'error',
				// 'import/no-unused-modules': 'off', // Disabled - incompatible with flat config, requires legacy .eslintrc
				'import/unambiguous': 'off',
				'import/no-commonjs': 'off',
				'import/no-amd': 'error',
				'import/no-nodejs-modules': 'off',
				'import/first': 'error',
				'import/exports-last': 'off',
				'import/no-duplicates': 'error',
				'import/no-namespace': 'off',
				'import/extensions': 'off', // Disabled - TypeScript handles this, causes issues with test files and relative imports
				'import/newline-after-import': 'error',
				'import/prefer-default-export': 'off',
				'import/max-dependencies': ['warn', { max: 20 }],
				'import/no-unassigned-import': 'off',
				'import/no-named-default': 'error',
				'import/no-default-export': 'off',
				'import/no-named-export': 'off',
				'import/no-anonymous-default-export': 'warn',
				'import/group-exports': 'off',
				'import/dynamic-import-chunkname': 'off',
				
				// JSX A11y plugin rules (only active for React/JSX files)
				'jsx-a11y/alt-text': 'error',
				'jsx-a11y/anchor-has-content': 'error',
				'jsx-a11y/anchor-is-valid': 'error',
				'jsx-a11y/aria-props': 'error',
				'jsx-a11y/aria-role': 'error',
				'jsx-a11y/aria-unsupported-elements': 'error',
				'jsx-a11y/click-events-have-key-events': 'warn',
				'jsx-a11y/heading-has-content': 'error',
				'jsx-a11y/html-has-lang': 'error',
				'jsx-a11y/iframe-has-title': 'error',
				'jsx-a11y/img-redundant-alt': 'error',
				'jsx-a11y/interactive-supports-focus': 'error',
				'jsx-a11y/label-has-associated-control': 'error',
				'jsx-a11y/media-has-caption': 'warn',
				'jsx-a11y/mouse-events-have-key-events': 'warn',
				'jsx-a11y/no-access-key': 'error',
				'jsx-a11y/no-autofocus': 'warn',
				'jsx-a11y/no-distracting-elements': 'error',
				'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
				'jsx-a11y/no-noninteractive-element-interactions': 'warn',
				'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
				'jsx-a11y/no-redundant-roles': 'error',
				'jsx-a11y/no-static-element-interactions': 'warn',
				'jsx-a11y/role-has-required-aria-props': 'error',
				'jsx-a11y/role-supports-aria-props': 'error',
				'jsx-a11y/scope': 'error',
				'jsx-a11y/tabindex-no-positive': 'error',
				
				// SonarJS plugin rules - Code smells and cognitive complexity
				'sonarjs/cognitive-complexity': ['error', 15], // More sophisticated than cyclomatic
				'sonarjs/no-identical-expressions': 'error',
				'sonarjs/no-identical-functions': 'error',
				'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
				'sonarjs/prefer-immediate-return': 'error',
				'sonarjs/prefer-object-literal': 'error',
				'sonarjs/prefer-single-boolean-return': 'error',
				'sonarjs/no-redundant-boolean': 'error',
				'sonarjs/no-unused-collection': 'error',
				'sonarjs/no-useless-catch': 'error',
				'sonarjs/prefer-while': 'error',
				'sonarjs/max-switch-cases': ['error', 30],
				'sonarjs/no-nested-switch': 'error',
				'sonarjs/no-nested-template-literals': 'error',
				'sonarjs/no-redundant-jump': 'error',
				'sonarjs/no-same-line-conditional': 'error',
				'sonarjs/non-existent-operator': 'error',
				
				// Unicorn plugin rules - Modern JavaScript best practices
				'unicorn/better-regex': 'error',
				'unicorn/catch-error-name': 'error',
				'unicorn/consistent-destructuring': 'error',
				'unicorn/consistent-function-scoping': 'error',
				'unicorn/custom-error-definition': 'error',
				'unicorn/error-message': 'error',
				'unicorn/escape-case': 'error',
				'unicorn/expiring-todo-comments': 'error',
				'unicorn/explicit-length-check': 'error',
				'unicorn/filename-case': ['warn', { 
					cases: {
						camelCase: true, // For folders: userAuth, licenseActivation
						pascalCase: true, // For class files: UserService.ts
					},
					ignore: [
						/.*API.*\.test\.ts$/,     // Allow API in test files
						/.*HTTP.*\.test\.ts$/,    // Allow HTTP in test files  
						/.*URL.*\.test\.ts$/,     // Allow URL in test files
						/.*JSON.*\.test\.ts$/,    // Allow JSON in test files
						/.*XML.*\.test\.ts$/,     // Allow XML in test files
						/.*SQL.*\.test\.ts$/      // Allow SQL in test files
					]
				}],
				'unicorn/import-style': 'error',
				'unicorn/new-for-builtins': 'error',
				'unicorn/no-abusive-eslint-disable': 'error',
				'unicorn/no-array-callback-reference': 'error',
				'unicorn/no-array-for-each': 'off', // Conflicts with functional/no-loop-statements - was converting forEach to for...of
				'unicorn/no-array-method-this-argument': 'error',
				'unicorn/no-array-push-push': 'error',
				'unicorn/no-array-reduce': 'warn',
				'unicorn/no-await-expression-member': 'error',
				'unicorn/no-console-spaces': 'error',
				'unicorn/no-document-cookie': 'error',
				'unicorn/no-empty-file': 'error',
				'unicorn/no-for-loop': 'error',
				'unicorn/no-hex-escape': 'error',
				'unicorn/no-instanceof-array': 'error',
				'unicorn/no-invalid-remove-event-listener': 'error',
				'unicorn/no-keyword-prefix': 'off',
				'unicorn/no-lonely-if': 'error',
				'unicorn/no-nested-ternary': 'error',
				'unicorn/no-new-array': 'error',
				'unicorn/no-new-buffer': 'error',
				'unicorn/no-null': 'error', // Use undefined instead of null per coding standards
				'unicorn/no-object-as-default-parameter': 'error',
				'unicorn/no-process-exit': 'error',
				'unicorn/no-static-only-class': 'error',
				'unicorn/no-thenable': 'error',
				'unicorn/no-this-assignment': 'error',
				'unicorn/no-typeof-undefined': 'error',
				'unicorn/no-unnecessary-await': 'error',
				'unicorn/no-unreadable-array-destructuring': 'error',
				'unicorn/no-unreadable-iife': 'error',
				'unicorn/no-unsafe-regex': 'error',
				'unicorn/no-unused-properties': 'off',
				'unicorn/no-useless-fallback-in-spread': 'error',
				'unicorn/no-useless-length-check': 'error',
				'unicorn/no-useless-promise-resolve-reject': 'error',
				'unicorn/no-useless-spread': 'error',
				'unicorn/no-useless-switch-case': 'error',
				'unicorn/no-zero-fractions': 'error',
				'unicorn/number-literal-case': 'error',
				'unicorn/numeric-separators-style': 'error',
				'unicorn/prefer-add-event-listener': 'error',
				'unicorn/prefer-array-find': 'error',
				'unicorn/prefer-array-flat': 'error',
				'unicorn/prefer-array-flat-map': 'error',
				'unicorn/prefer-array-index-of': 'error',
				'unicorn/prefer-array-some': 'error',
				'unicorn/prefer-at': 'error',
				'unicorn/prefer-code-point': 'error',
				'unicorn/prefer-date-now': 'error',
				'unicorn/prefer-default-parameters': 'error',
				'unicorn/prefer-dom-node-append': 'error',
				'unicorn/prefer-dom-node-dataset': 'error',
				'unicorn/prefer-dom-node-remove': 'error',
				'unicorn/prefer-dom-node-text-content': 'error',
				'unicorn/prefer-includes': 'error',
				'unicorn/prefer-json-parse-buffer': 'off',
				'unicorn/prefer-keyboard-event-key': 'error',
				'unicorn/prefer-logical-operator-over-ternary': 'error',
				'unicorn/prefer-math-trunc': 'error',
				'unicorn/prefer-modern-dom-apis': 'error',
				'unicorn/prefer-modern-math-apis': 'error',
				'unicorn/prefer-module': 'error',
				'unicorn/prefer-native-coercion-functions': 'error',
				'unicorn/prefer-negative-index': 'error',
				'unicorn/prefer-node-protocol': 'error',
				'unicorn/prefer-number-properties': 'error',
				'unicorn/prefer-object-from-entries': 'error',
				'unicorn/prefer-optional-catch-binding': 'error',
				'unicorn/prefer-prototype-methods': 'error',
				'unicorn/prefer-query-selector': 'error',
				'unicorn/prefer-reflect-apply': 'error',
				'unicorn/prefer-regexp-test': 'error',
				'unicorn/prefer-set-has': 'error',
				'unicorn/prefer-set-size': 'error',
				'unicorn/prefer-spread': 'error',
				'unicorn/prefer-string-replace-all': 'error',
				'unicorn/prefer-string-slice': 'error',
				'unicorn/prefer-string-starts-ends-with': 'error',
				'unicorn/prefer-string-trim-start-end': 'error',
				'unicorn/prefer-switch': 'error',
				'unicorn/prefer-ternary': 'error',
				'unicorn/prefer-top-level-await': 'error',
				'unicorn/prefer-type-error': 'error',
				'unicorn/prevent-abbreviations': 'off', // Too aggressive for existing code
				'unicorn/relative-url-style': 'error',
				'unicorn/require-array-join-separator': 'error',
				'unicorn/require-number-to-fixed-digits-argument': 'error',
				'unicorn/require-post-message-target-origin': 'error',
				'unicorn/string-content': 'off',
				'unicorn/switch-case-braces': 'error',
				'unicorn/template-indent': 'warn',
				'unicorn/text-encoding-identifier-case': 'error',
				'unicorn/throw-new-error': 'error',
				
				// No Secrets plugin rules - Prevent secrets in code
				'no-secrets/no-secrets': ['error', {
					tolerance: 4.2,
					ignoreContent: '^CHANGE ME$',
					ignoreModules: true,
					ignoreIdentifiers: ['BASE64_CHARS', 'HEX_CHARS'],
					additionalRegexes: {
						'AWS Access Key': 'AKIA[0-9A-Z]{16}',
						'GitHub Token': 'ghp_[a-zA-Z0-9]{36}',
						'JWT Token': 'eyJ[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*'
					}
				}],
				
				// RegExp plugin rules - Essential RegExp safety (conservative set for v2.9.0)
				'regexp/no-control-character': 'error',
				'regexp/no-empty-character-class': 'error',
				'regexp/no-empty-group': 'error',
				'regexp/no-invalid-regexp': 'error',
				'regexp/no-misleading-capturing-group': 'error',
				'regexp/no-misleading-unicode-character': 'error',
				'regexp/no-super-linear-backtracking': 'error', // Prevents ReDoS
				'regexp/no-unused-capturing-group': 'error',
				'regexp/no-useless-character-class': 'error',
				'regexp/no-useless-escape': 'error',
				'regexp/no-useless-flag': 'error',
				'regexp/no-useless-quantifier': 'error',
				'regexp/no-useless-range': 'error',
				'regexp/prefer-character-class': 'error',
				'regexp/prefer-d': 'error',
				'regexp/prefer-plus-quantifier': 'error',
				'regexp/prefer-star-quantifier': 'error',
				'regexp/prefer-w': 'error',
				
				// Functional plugin rules - Pragmatic immutability and functional programming
				'functional/no-let': 'off', // Disabled - prefer-const rule is smarter and less prone to false positives
				'functional/prefer-readonly-type': 'off', // Disabled - too aggressive, breaks compilation and practical code patterns
				'functional/no-method-signature': 'off', // Allow method signatures in interfaces
				'functional/no-expression-statements': 'off', // Too restrictive for most code
				'functional/functional-parameters': 'off', // Too restrictive
				'functional/no-return-void': 'off', // Allow void returns
				'functional/no-conditional-statements': 'off', // Too restrictive
				'functional/no-loop-statements': 'off', // Allow both loops and functional methods - choose based on use case
				'functional/immutable-data': 'off', // Too restrictive for practical JavaScript/TypeScript development patterns
				'functional/no-throw-statements': 'off', // Allow throwing errors
				'functional/no-try-statements': 'off', // Allow try-catch
				'functional/no-promise-reject': 'off', // Allow promise rejection
				
				// Custom rules for coding standards compliance
				'unicorn/prefer-query-selector': 'off', // Allow different DOM query methods
				'unicorn/prevent-abbreviations': 'off', // Allow abbreviations for domain-specific terms
				
				// Allow custom rules to be added
				...rules
			},
		},
		// Prettier config for TypeScript/JavaScript files with Allman brace style
		{
			files: ['**/*.{tsx,jsx,ts,js}'],
			rules: {
				'prettier/prettier': [
					'error',
					{
						parser: 'typescript',
						plugins: [import.meta.resolve('prettier-plugin-brace-style')],
						braceStyle: 'allman',
						singleQuote: true,
						useTabs: true,
						tabWidth: 4,
						semi: true,
						trailingComma: 'none'
					}
				]
			}
		},
		// Prettier config for Astro files
		{
			files: ['**/*.astro'],
			rules: {
				'prettier/prettier': [
					'error',
					{
						parser: 'astro',
						plugins: [import.meta.resolve('prettier-plugin-astro')],
						singleQuote: true,
						useTabs: true,
						tabWidth: 4,
						semi: true,
						trailingComma: 'none'
					}
				]
			}
		},
		// Test file specific overrides
		{
			files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}', '**/tests/**/*.{js,ts}'],
			ignores: ['**/tests/fixtures/**/*'], // Don't apply test overrides to fixture files
			rules: {
				// Disable function scoping rule for test helpers
				'unicorn/consistent-function-scoping': 'off',
				
				// Allow test URLs and API endpoints without triggering secrets detection
				'no-secrets/no-secrets': 'off',
				
				// Allow only universally understood abbreviations
				'id-length': ['warn', { 
					min: 3,
					exceptions: ['id', 'fn']
				}],
				
				// Disable rules inappropriate for test files
				'functional/no-loop-statements': 'off',      // Loops are often clearer than functional alternatives in tests
				'functional/no-let': 'off',                  // Test setup requires mutable variables
				'functional/immutable-data': 'off',          // Test mocking requires object mutations
				'security/detect-non-literal-fs-filename': 'off', // Tests legitimately need dynamic file paths
				'unicorn/prefer-module': 'off',              // Tests may need __dirname for reliable paths
				
				// Relax complexity rules for test files
				'max-lines-per-function': ['error', {
					max: 300,
					skipBlankLines: true,
					skipComments: true,
					IIFEs: true
				}],
				'max-lines': ['warn', {
					max: 500,
					skipBlankLines: true,
					skipComments: true
				}],
				'complexity': ['error', 20], // Higher complexity allowed in tests
				'max-statements': ['error', 40], // More statements allowed in test functions
				'sonarjs/cognitive-complexity': ['error', 30], // Higher cognitive complexity for tests
				
				// Keep as warnings - still worth improving when possible
				'unicorn/no-null': 'off',                    // APIs often use null, but const can be better
				'sonarjs/no-duplicate-string': 'off',        // Test strings repeat, but constants still help readability
			},
		},
	];
}