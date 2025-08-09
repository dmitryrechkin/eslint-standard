#!/usr/bin/env node

/**
 * @file CLI Setup for Aggressive Unused Code Detection
 * 
 * This CLI tool helps set up aggressive unused code detection and cleanup
 * in your project with external tools and optimal configurations.
 * 
 * @author PageFast Team
 * @version 1.0.0
 */

import { setupAggressiveCleanup } from '../configs/external-tools-setup.mjs';

// Simple command line argument parsing (avoiding external dependencies)
const args = process.argv.slice(2);
const options = {
	global: args.includes('--global') || args.includes('-g'),
	packageManager: args.find((arg, i) => (args[i-1] === '--package-manager' || args[i-1] === '-p')) || 'npm',
	dryRun: args.includes('--dry-run'),
	help: args.includes('--help') || args.includes('-h')
};

/**
 * Main CLI program for setting up aggressive cleanup
 */
async function main()
{
	try
	{
		if (options.help)
		{
			console.log(`
@dmitryrechkin/eslint-standard - Aggressive Cleanup Setup

Usage:
  npx @dmitryrechkin/eslint-standard setup-aggressive-cleanup [options]

Options:
  -g, --global                 Install cleanup tools globally
  -p, --package-manager <type> Package manager to use (npm, pnpm, yarn)
  --dry-run                   Show what would be done without making changes
  -h, --help                  Show this help message

Examples:
  npx @dmitryrechkin/eslint-standard setup-aggressive-cleanup
  npx @dmitryrechkin/eslint-standard setup-aggressive-cleanup --global
  npx @dmitryrechkin/eslint-standard setup-aggressive-cleanup -p pnpm
  npx @dmitryrechkin/eslint-standard setup-aggressive-cleanup --dry-run
			`);
			return;
		}

		if (options.dryRun)
		{
			console.log('🔍 DRY RUN - Would perform the following actions:\n');
			console.log('1. Install external cleanup tools:');
			console.log('   - ts-prune (find unused exports)');
			console.log('   - unimported (find unused files)'); 
			console.log('   - knip (advanced dead code elimination)');
			console.log('   - depcheck (find unused dependencies)');
			console.log('   - ts-remove-unused (remove unused imports)');
			console.log('\n2. Add cleanup scripts to package.json');
			console.log('\n3. Create optimal tsconfig.json for unused code detection');
			console.log('\n4. Create knip.json configuration');
			console.log('\nRun without --dry-run to actually perform setup.');
			return;
		}

		await setupAggressiveCleanup({
			packageManager: options.packageManager,
			globalTools: options.global
		});

		console.log('\n🎉 Setup complete! Next steps:');
		console.log('\n1. Enable aggressive cleanup in your ESLint config:');
		console.log('   ```javascript');
		console.log('   import baseConfig from "@dmitryrechkin/eslint-standard";');
		console.log('   export default baseConfig({');
		console.log('     aggressiveCleanup: true // 🔥 Enable aggressive mode');
		console.log('   });');
		console.log('   ```');
		console.log('\n2. Run cleanup check:');
		console.log('   npm run cleanup:check');
		console.log('\n3. Review and fix issues:');
		console.log('   npm run cleanup:fix');

	}
	catch (error)
	{
		console.error('\n❌ Setup failed:', error.message);
		process.exit(1);
	}
}

// Run the main function
main();