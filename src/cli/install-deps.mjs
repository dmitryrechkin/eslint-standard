#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get peer dependencies from our package.json
const packageJsonPath = join(__dirname, '../../package.json');
let peerDeps = {};

try {
	const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
	peerDeps = packageJson.peerDependencies || {};
} catch (error) {
	console.error('❌ Could not read package.json:', error.message);
	process.exit(1);
}

const depsToInstall = Object.entries(peerDeps).map(([dep, version]) => `${dep}@${version}`);

if (depsToInstall.length === 0) {
	console.log('✅ No peer dependencies to install.');
	process.exit(0);
}

// Check for lockfiles to determine package manager
const projectRoot = process.cwd();
let packageManager = 'npm';
let installArgs = ['install', '--save-dev'];

if (existsSync(join(projectRoot, 'pnpm-lock.yaml'))) {
	packageManager = 'pnpm';
	installArgs = ['add', '-D'];
} else if (existsSync(join(projectRoot, 'yarn.lock'))) {
	packageManager = 'yarn';
	installArgs = ['add', '-D'];
} else if (existsSync(join(projectRoot, 'bun.lockb'))) {
	packageManager = 'bun';
	installArgs = ['add', '-D'];
}

console.log(`📦 Installing peer dependencies using ${packageManager}...`);
console.log(`   ${depsToInstall.join(' ')}\n`);

// Use shell: true on Windows compatibility or if packageManager is a .cmd/.bat file,
// but generally spawnSync handles this better than execSync.
// However, 'npm' often needs a shell on Windows or when run via npx.
// Using shell: true is standard for cross-platform npm execution unless using .cmd explicitly on Windows.
const result = spawnSync(packageManager, [...installArgs, ...depsToInstall], {
	stdio: 'inherit',
	shell: true
});

if (result.status !== 0) {
	console.error('❌ Installation failed');
	process.exit(result.status || 1);
}

console.log('\n✅ Peer dependencies installed successfully!');

export default function installDeps() {
	// Export for programmatic use
}
