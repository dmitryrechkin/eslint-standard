#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Detect package manager
function detectPackageManager() {
	if (existsSync('pnpm-lock.yaml')) return 'pnpm';
	if (existsSync('yarn.lock')) return 'yarn';
	if (existsSync('package-lock.json')) return 'npm';
	if (existsSync('bun.lockb')) return 'bun';
	return 'npm'; // default
}

// Get peer dependencies from package.json
const packageJsonPath = join(__dirname, '../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const peerDeps = packageJson.peerDependencies || {};

// Build install command
const packageManager = detectPackageManager();
const deps = Object.entries(peerDeps).map(([name, version]) => `${name}@${version}`).join(' ');

const installCommands = {
	npm: `npm install --save-dev ${deps}`,
	pnpm: `pnpm add -D ${deps}`,
	yarn: `yarn add -D ${deps}`,
	bun: `bun add -d ${deps}`
};

const command = installCommands[packageManager];

console.log(`🔧 Installing ESLint Standard peer dependencies...`);
console.log(`📦 Detected package manager: ${packageManager}`);
console.log(`📋 Running: ${command}\n`);

try {
	execSync(command, { stdio: 'inherit' });
	console.log('\n✅ All peer dependencies installed successfully!');
} catch (error) {
	console.error('\n❌ Failed to install dependencies. Please run manually:');
	console.error(command);
	process.exit(1);
}