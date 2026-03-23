/**
 * ESLint 9.x Flat Config for @dmitryrechkin/eslint-standard
 */
import type { Linter } from 'eslint';

/**
 * Configuration options for ESLint standard setup
 */
export interface TypeEslintStandardOptions
{
	/**
	 * Path to the TypeScript config file for ESLint type-aware rules.
	 * @default './tsconfig.json'
	 */
	tsconfigPath?: string;

	/**
	 * Additional patterns to ignore.
	 * @default []
	 */
	ignores?: string[];

	/**
	 * File patterns to apply this config to.
	 * @default []
	 */
	files?: string[];

	/**
	 * Additional ESLint plugins to include.
	 * @default {}
	 */
	plugins?: Record<string, unknown>;

	/**
	 * Additional ESLint rules to override or extend defaults.
	 * @default {}
	 */
	rules?: Record<string, unknown>;

	/**
	 * Whether to enable strict mode (architecture enforcement).
	 * @default false
	 */
	strict?: boolean;

	/**
	 * External prettier plugin to use instead of the bundled one.
	 * Pass in the prettier plugin from your consuming project for optimal compatibility.
	 */
	prettierPlugin?: unknown;
}

/**
 * Creates an ESLint flat config array with standard rules.
 * @param {TypeEslintStandardOptions} options - Configuration options for ESLint standard
 * @returns {Linter.Config[]} Array of ESLint configuration objects
 *
 * @example
 * ```ts
 * import eslintConfig from '@dmitryrechkin/eslint-standard';
 *
 * export default eslintConfig({
 *   tsconfigPath: './tsconfig.json'
 * });
 * ```
 *
 * @example
 * ```ts
 * import eslintConfig from '@dmitryrechkin/eslint-standard';
 * import prettierPlugin from 'eslint-plugin-prettier';
 *
 * export default eslintConfig({
 *   strict: true,
 *   prettierPlugin
 * });
 * ```
 */
declare function eslintStandard(
	options?: TypeEslintStandardOptions
): Linter.Config[];

export default eslintStandard;
