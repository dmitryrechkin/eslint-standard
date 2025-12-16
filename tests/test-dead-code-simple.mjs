#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('💀 Testing Dead Code Cleanup Rules (Simple)\n');

// Create a temporary ESLint config with only dead code rules
const tempConfigPath = path.join(__dirname, 'temp-dead-code-config.mjs');
const tempConfigContent = `
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
	js.configs.recommended,
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
		},
		rules: {
			// Basic ESLint dead code rules
			'no-var': 'error',
			'no-undef-init': 'error',
			'no-unreachable': 'error',
			'no-constant-condition': 'error',
			'no-else-return': 'error',
			'no-return-assign': 'error',

			// TypeScript ESLint dead code rules
			'@typescript-eslint/no-unused-vars': ['error', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
				ignoreRestSiblings: true
			}],
			'@typescript-eslint/no-useless-constructor': 'error',
			'@typescript-eslint/no-empty-function': 'warn',
			'@typescript-eslint/no-empty-interface': 'warn',
			'@typescript-eslint/class-methods-use-this': 'error',
			'@typescript-eslint/no-invalid-this': 'error',
		},
	},
];
`;

fs.writeFileSync(tempConfigPath, tempConfigContent);

const fixtures = {
	violations: path.join(__dirname, 'fixtures/dead-code-violations.ts'),
	good: path.join(__dirname, 'fixtures/dead-code-good.ts')
};

console.log('📋 Testing violations file...\n');

// Test violations file
try {
	const result = execSync(`npx eslint "${fixtures.violations}" --config "${tempConfigPath}"`, {
		stdio: 'pipe',
		cwd: path.join(__dirname, '..'),
		encoding: 'utf8'
	});

	console.log('❌ Expected violations but got none');
} catch (error) {
	const output = error.stdout || error.stderr || '';

	// Parse output to count violations
	const lines = output.split('\n').filter(line => line.trim());
	const errors = lines.filter(line => line.includes('error'));
	const warnings = lines.filter(line => line.includes('warning'));

	console.log(`✅ Found ${errors.length} errors and ${warnings.length} warnings`);

	// Show unique rules triggered
	const rules = new Set();
	lines.forEach(line => {
		const match = line.match(/([a-z@/-]+(?:\[[a-z-]+\])?)/);
		if (match) {
			rules.add(match[1]);
		}
	});

	console.log('\n📌 Rules triggered:');
	rules.forEach(rule => {
		console.log(`   - ${rule}`);
	});

	// Show some example violations
	console.log('\n📝 Example violations:');
	errors.slice(0, 5).forEach(error => {
		console.log(`   ${error}`);
	});

	if (errors.length > 5) {
		console.log(`   ... and ${errors.length - 5} more`);
	}
}

console.log('\n✨ Testing good code file...\n');

// Test good file
try {
	const result = execSync(`npx eslint "${fixtures.good}" --config "${tempConfigPath}"`, {
		stdio: 'pipe',
		cwd: path.join(__dirname, '..'),
		encoding: 'utf8'
	});

	console.log('✅ Good code file passed all rules!');
} catch (error) {
	const output = error.stdout || error.stderr || '';
	const lines = output.split('\n').filter(line => line.trim());

	if (lines.length > 0) {
		console.log('⚠️  Good code file has issues:');
		lines.slice(0, 10).forEach(line => {
			console.log(`   ${line}`);
		});

		if (lines.length > 10) {
			console.log(`   ... and ${lines.length - 10} more`);
		}
	}
}

// Cleanup temp config
fs.unlinkSync(tempConfigPath);

console.log('\n🎉 Dead Code Rules Test Complete!');
console.log('\n💡 To run ESLint with these rules on your project:');
console.log('   npx eslint --fix your-files.ts');

// Test individual rule on a simple example
console.log('\n🔍 Testing individual rules...');

const simpleTestFile = path.join(__dirname, 'temp-test.ts');
const simpleTestCode = `
var oldVar = 'test';
let undef = undefined;
if (false) {
	console.log('unreachable');
}
function test() {
	return;
	console.log('also unreachable');
}
`;

fs.writeFileSync(simpleTestFile, simpleTestCode);

try {
	const result = execSync(`npx eslint "${simpleTestFile}" --config "${tempConfigPath}"`, {
		stdio: 'pipe',
		cwd: path.join(__dirname, '..'),
		encoding: 'utf8'
	});
	console.log('No violations detected in simple test');
} catch (error) {
	const output = error.stdout || error.stderr || '';
	const violations = output.split('\n').filter(line => line.trim());
	console.log(`✅ Simple test detected ${violations.length} violations`);
}

// Cleanup
fs.unlinkSync(simpleTestFile);