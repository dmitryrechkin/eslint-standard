#!/usr/bin/env node

import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Running All ESLint Standard Tests\n');
console.log('=' .repeat(50));

const tests = [
	{
		name: 'Formatting & Organization',
		script: 'test-runner.mjs',
		description: 'Tests import sorting, JSDoc generation, class member ordering'
	},
	{
		name: 'Complexity Rules',
		script: 'test-complexity-rules.mjs',
		description: 'Tests cyclomatic complexity, function length, nesting depth, etc.'
	},
	{
		name: 'Safety Rules',
		script: 'test-safety-rules.mjs',
		description: 'Tests promise safety, type safety, security, and error handling'
	},
	{
		name: 'Security Rules',
		script: 'test-security-rules.mjs',
		description: 'Tests security plugin rules and secret detection'
	},
	{
		name: 'SonarJS Rules',
		script: 'test-sonarjs-rules.mjs',
		description: 'Tests code smells, cognitive complexity, and maintainability'
	},
	{
		name: 'Unicorn Rules',
		script: 'test-unicorn-rules.mjs',
		description: 'Tests modern JavaScript patterns and best practices'
	},
	{
		name: 'Spacing Rules',
		script: 'test-spacing-rules.mjs',
		description: 'Tests code density, blank lines between statements and class members'
	},
	{
		name: 'Strict Conventions',
		script: 'test-strict-rules.mjs',
		description: 'Tests interface enforcement, service method limits, and naming conventions'
	},
	{
		name: 'Separation Rules',
		script: 'test-separation-rules.mjs',
		description: 'Tests strict separation of schemas, types, and constants from class files'
	}
];

let passedTests = 0;
const results = [];

// Run each test
for (const test of tests) {
	console.log(`\n📌 ${test.name}`);
	console.log(`   ${test.description}`);
	console.log('-'.repeat(50));
	
	try {
		execSync(`node ${test.script}`, {
			stdio: 'inherit',
			cwd: __dirname,
			timeout: 180000 // 180 second timeout per test (Unicorn takes ~87s, Safety ~53s)
		});
		passedTests++;
		results.push({ name: test.name, status: '✅ PASSED' });
	} catch (error) {
		if (error.signal === 'SIGTERM') {
			results.push({ name: test.name, status: '⏰ TIMEOUT' });
		} else {
			results.push({ name: test.name, status: '❌ FAILED' });
		}
	}
	
	console.log('\n' + '='.repeat(50));
}

// Summary
console.log('\n📊 Test Summary\n');
console.log('Test Suite'.padEnd(30) + 'Status');
console.log('-'.repeat(40));

for (const result of results) {
	console.log(result.name.padEnd(30) + result.status);
}

console.log('-'.repeat(40));
console.log(`Total: ${passedTests}/${tests.length} passed`);

// Overall result
if (passedTests === tests.length) {
	console.log('\n🎉 All tests passed! The ESLint configuration is working correctly.');
	process.exit(0);
} else {
	console.log('\n❌ Some tests failed. Please check the output above.');
	process.exit(1);
}