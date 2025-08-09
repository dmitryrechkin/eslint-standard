/**
 * @file Example: Using Aggressive Cleanup Configuration
 * 
 * This example shows how to enable aggressive unused code detection
 * and cleanup in your ESLint configuration.
 * 
 * @author PageFast Team
 * @version 1.0.0
 */

import baseConfig from '@dmitryrechkin/eslint-standard';

// ========================================
// STANDARD CONFIGURATION (Default)
// ========================================

/**
 * Standard configuration with basic unused code detection
 * - Detects and removes unused imports
 * - Detects unused variables/functions (but doesn't remove them)
 * - Basic dead code detection
 */
const standardConfig = baseConfig({
	tsconfigPath: './tsconfig.json',
	ignores: ['dist/**', 'build/**'],
	files: ['**/*.{js,ts,tsx}']
});

// ========================================
// AGGRESSIVE CLEANUP CONFIGURATION
// ========================================

/**
 * Aggressive configuration with enhanced unused code detection
 * - More strict unused variable detection
 * - Enhanced dead code detection
 * - Unused exports detection (when possible)
 * - More aggressive import/export cleanup
 * - TypeScript-specific cleanup rules
 */
const aggressiveConfig = baseConfig({
	tsconfigPath: './tsconfig.json',
	ignores: ['dist/**', 'build/**'],
	files: ['**/*.{js,ts,tsx}'],
	aggressiveCleanup: true, // 🔥 Enable aggressive cleanup
	rules: {
		// Override specific rules if needed
		'unicorn/no-unused-properties': 'error', // Make this an error instead of warning
		'@typescript-eslint/no-unused-vars': ['error', {
			// Custom unused vars configuration
			argsIgnorePattern: '^_|^__unused',
			varsIgnorePattern: '^_|^__unused'
		}]
	}
});

// ========================================
// GRADUAL ADOPTION STRATEGY
// ========================================

/**
 * Gradual adoption: Start with warnings for aggressive rules
 * This allows you to see what would be caught without breaking CI
 */
const gradualConfig = baseConfig({
	tsconfigPath: './tsconfig.json',
	aggressiveCleanup: true,
	rules: {
		// Downgrade aggressive rules to warnings initially
		'import/no-unused-modules': 'warn',
		'unicorn/no-unused-properties': 'warn',
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
	}
});

// ========================================
// PROJECT-SPECIFIC CONFIGURATIONS
// ========================================

/**
 * Configuration for libraries/packages
 * More strict about exports since they're public API
 */
const libraryConfig = baseConfig({
	tsconfigPath: './tsconfig.json',
	aggressiveCleanup: true,
	rules: {
		// Libraries should be strict about unused exports
		'import/no-unused-modules': ['error', {
			unusedExports: true,
			src: ['src/**/*'],
			ignoreExports: ['**/index.{js,ts}'] // Only ignore index files
		}]
	}
});

/**
 * Configuration for applications
 * More lenient about exports but strict about internal code
 */
const applicationConfig = baseConfig({
	tsconfigPath: './tsconfig.json',
	aggressiveCleanup: true,
	rules: {
		// Applications can be more lenient about unused exports
		'import/no-unused-modules': ['warn', {
			unusedExports: true,
			src: ['src/**/*'],
			ignoreExports: [
				'**/index.{js,ts}',
				'**/main.{js,ts}',
				'**/app.{js,ts}',
				'**/*.config.{js,ts}'
			]
		}]
	}
});

// ========================================
// EXPORT CONFIGURATIONS
// ========================================

// Choose your configuration based on your project needs:

// For most projects (recommended starting point)
export default standardConfig;

// For aggressive cleanup (use with caution)
// export default aggressiveConfig;

// For gradual adoption
// export default gradualConfig;

// For library projects
// export default libraryConfig;

// For application projects
// export default applicationConfig;