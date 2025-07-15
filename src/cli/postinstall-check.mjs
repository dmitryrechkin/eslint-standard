#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Don't run during local development
if (!__dirname.includes('node_modules')) {
	process.exit(0);
}

// Check if we're in CI environment
const isCI = process.env.CI || process.env.CONTINUOUS_INTEGRATION || process.env.GITHUB_ACTIONS;

// Check if scripts are disabled
const npmConfigIgnoreScripts = process.env.npm_config_ignore_scripts === 'true';

if (isCI || npmConfigIgnoreScripts) {
	// Silent exit in CI or when scripts are disabled
	process.exit(0);
}

// Simple check for missing dependencies
try {
	const packageJsonPath = join(__dirname, '../../package.json');
	const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
	const peerDeps = Object.keys(packageJson.peerDependencies || {});
	
	// Quick check if any peer deps are missing
	let missingCount = 0;
	for (const dep of peerDeps) {
		try {
			// Try to resolve the dependency
			require.resolve(dep, { paths: [process.cwd()] });
		} catch {
			missingCount++;
		}
	}
	
	if (missingCount > 0) {
		console.log(`
⚠️  @dmitryrechkin/eslint-standard: ${missingCount} peer dependencies are missing!

Run this command to check and install them:
👉 ${'\x1b[36m'}npx @dmitryrechkin/eslint-standard check-deps --install${'\x1b[0m'}
`);
	}
} catch (error) {
	// Silent fail - don't break installation
}