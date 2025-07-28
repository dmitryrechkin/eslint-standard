#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔍 Debug Information:\n');
console.log('Current directory:', __dirname);
console.log('Parent directory:', path.join(__dirname, '..'));
console.log('Config path:', path.join(__dirname, 'test-config.mjs'));

// Check if files exist
const configExists = fs.existsSync(path.join(__dirname, 'test-config.mjs'));
const fixtureExists = fs.existsSync(path.join(__dirname, 'fixtures/complexity-violations.ts'));

console.log('\nFile checks:');
console.log('Config exists:', configExists);
console.log('Fixture exists:', fixtureExists);

// Try to run ESLint with more debugging
console.log('\n🧪 Running ESLint with debug output...\n');

try {
	const result = execSync(`npx eslint --version`, { 
		cwd: path.join(__dirname, '..'),
		encoding: 'utf8'
	});
	console.log('ESLint version:', result);
} catch (error) {
	console.error('Error getting ESLint version:', error.message);
}

// Try to lint a simple file
console.log('\n🧪 Testing ESLint on fixture...\n');

try {
	const result = execSync(`npx eslint tests/fixtures/complexity-violations.ts --config tests/test-config.mjs --debug`, { 
		cwd: path.join(__dirname, '..'),
		encoding: 'utf8',
		maxBuffer: 1024 * 1024 * 10 // 10MB buffer
	});
	console.log('ESLint output:', result);
} catch (error) {
	console.error('ESLint error output:');
	console.error(error.stdout || error.message);
	
	if (error.stderr) {
		console.error('\nStderr:', error.stderr);
	}
}