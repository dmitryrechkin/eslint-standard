#!/usr/bin/env node

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Don't run during local development
if (!__dirname.includes('node_modules')) {
	process.exit(0);
}

// Check environment variables for auto-install preference
const autoInstall = process.env.ESLINT_STANDARD_AUTO_INSTALL === 'true';
const skipInstall = process.env.ESLINT_STANDARD_SKIP_INSTALL === 'true';

// Check if we're in CI environment
const isCI = process.env.CI || process.env.CONTINUOUS_INTEGRATION || process.env.GITHUB_ACTIONS;

if (skipInstall || isCI) {
	process.exit(0);
}

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🎉 Thanks for installing @dmitryrechkin/eslint-standard!    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

📦 This package requires peer dependencies to work properly.

🚀 Quick install (auto-detects your package manager):
   ${'\x1b[36m'}npx @dmitryrechkin/eslint-standard check-deps --install${'\x1b[0m'}

📋 Or install all dependencies directly:
   ${'\x1b[90m'}npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-unused-imports @stylistic/eslint-plugin eslint-plugin-jsdoc eslint-plugin-simple-import-sort eslint-plugin-perfectionist${'\x1b[0m'}

🔍 To check if all dependencies are installed:
   ${'\x1b[36m'}npx @dmitryrechkin/eslint-standard check-deps${'\x1b[0m'}

📚 Documentation: https://github.com/dmitryrechkin/eslint-standard
`);

// Don't run check-deps in postinstall to avoid errors
// Users can run it manually with: npx @dmitryrechkin/eslint-standard check-deps

if (autoInstall) {
	console.log('\n🤖 Auto-install enabled via ESLINT_STANDARD_AUTO_INSTALL=true');
	console.log('📦 Checking and installing peer dependencies...\n');
	
	try {
		// Run check-deps with --install flag
		const { execSync } = await import('node:child_process');
		execSync('node ' + join(__dirname, 'index.mjs') + ' check-deps --install', {
			stdio: 'inherit',
			cwd: process.cwd()
		});
	} catch (error) {
		console.error('❌ Auto-install failed. Please run manually:');
		console.error('   npx @dmitryrechkin/eslint-standard check-deps --install');
	}
}