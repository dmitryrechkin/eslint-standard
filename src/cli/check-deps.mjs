#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check for --install flag
const shouldInstall = process.argv.includes('--install');

// Get peer dependencies
const packageJsonPath = join(__dirname, '../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const peerDeps = packageJson.peerDependencies || {};

// Check if running from node_modules and find project root
// We primarily use process.cwd() as this is a CLI tool meant to run in the target project
const projectRoot = process.cwd();

// Read project's package.json
let projectPackageJson;
try {
	projectPackageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
} catch (error) {
	console.error('❌ Could not read project package.json');
	console.error(`Checked in: ${projectRoot}`);
	process.exit(1);
}

const allDeps = {
	...projectPackageJson.dependencies || {},
	...projectPackageJson.devDependencies || {}
};

console.log('🔍 Checking ESLint Standard peer dependencies...\n');

let missingDeps = [];
let outdatedDeps = [];

for (const [dep, requiredVersion] of Object.entries(peerDeps)) {
	if (!allDeps[dep]) {
		missingDeps.push(`${dep}@${requiredVersion}`);
		console.log(`❌ Missing: ${dep} (required: ${requiredVersion})`);
	} else {
		console.log(`✅ Found: ${dep}@${allDeps[dep]}`);
		// Simple version check - could be improved
		if (!allDeps[dep].includes('^') && !allDeps[dep].includes('~') && allDeps[dep] !== requiredVersion) {
			outdatedDeps.push(`${dep} (installed: ${allDeps[dep]}, required: ${requiredVersion})`);
		}
	}
}

console.log('\n📊 Summary:');
if (missingDeps.length === 0 && outdatedDeps.length === 0) {
	console.log('✅ All peer dependencies are satisfied!');
} else {
	if (missingDeps.length > 0) {
		console.log(`\n❌ Missing ${missingDeps.length} dependencies:`);
		missingDeps.forEach(dep => console.log(`  - ${dep}`));

		if (shouldInstall) {
			console.log('\n🔧 Auto-installing missing dependencies...\n');

			// Import and run the install-deps script
			try {
				await import('./install-deps.mjs');
				// The install-deps script will handle the installation
			} catch (error) {
				console.error('❌ Failed to auto-install dependencies:', error.message);
				process.exit(1);
			}
		} else {
			console.log('\n💡 To install missing dependencies:');
			console.log('   npx @dmitryrechkin/eslint-standard install-deps');
			console.log('   or run this command with --install flag');
		}
	}
	if (outdatedDeps.length > 0) {
		console.log(`\n⚠️  ${outdatedDeps.length} dependencies may be outdated:`);
		outdatedDeps.forEach(dep => console.log(`  - ${dep}`));
	}

	if (!shouldInstall && missingDeps.length > 0) {
		process.exit(1);
	}
}

export default function checkDeps() {
	// Export for programmatic use
}
