#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get peer dependencies
const packageJsonPath = join(__dirname, '../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const peerDeps = packageJson.peerDependencies || {};

// Check if running from node_modules
const isInNodeModules = __dirname.includes('node_modules');
const projectRoot = isInNodeModules 
	? resolve(__dirname, '../../../../') 
	: process.cwd();

// Read project's package.json
let projectPackageJson;
try {
	projectPackageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
} catch (error) {
	console.error('❌ Could not read project package.json');
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
		console.log('Run: npx @dmitryrechkin/eslint-standard install-deps');
	}
	if (outdatedDeps.length > 0) {
		console.log(`\n⚠️  ${outdatedDeps.length} dependencies may be outdated:`);
		outdatedDeps.forEach(dep => console.log(`  - ${dep}`));
	}
	process.exit(1);
}

export default function checkDeps() {
	// Export for programmatic use
}