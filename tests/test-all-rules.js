#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Running All ESLint Standard Tests\n');
console.log('=' .repeat(50));

const tests = [
	{
		name: 'Formatting & Organization',
		script: 'test-runner.js',
		description: 'Tests import sorting, JSDoc generation, class member ordering'
	},
	{
		name: 'Complexity Rules',
		script: 'test-complexity-rules.js',
		description: 'Tests cyclomatic complexity, function length, nesting depth, etc.'
	},
	{
		name: 'Safety Rules',
		script: 'test-safety-rules.js',
		description: 'Tests promise safety, type safety, security, and error handling'
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
			cwd: __dirname
		});
		passedTests++;
		results.push({ name: test.name, status: '✅ PASSED' });
	} catch (error) {
		results.push({ name: test.name, status: '❌ FAILED' });
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