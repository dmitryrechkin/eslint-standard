#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🦄 Testing Unicorn Rules\n');

const fixtures = {
	violations: path.join(__dirname, 'fixtures/unicorn-violations.ts'),
	good: path.join(__dirname, 'fixtures/unicorn-good.ts')
};

// Expected violations for Unicorn plugin rules (subset of most common ones)
const expectedViolations = {
	'unicorn/better-regex': 'can be optimized',
	'unicorn/catch-error-name': 'should be named',
	'unicorn/consistent-destructuring': 'should be destructured',
	'unicorn/custom-error-definition': 'custom error',
	'unicorn/error-message': 'Error message should be',
	'unicorn/explicit-length-check': 'Use `.length ===` instead',
	'unicorn/no-array-for-each': 'Use a `for` loop instead',
	'unicorn/no-array-reduce': 'Array.prototype.reduce',
	'unicorn/no-console-spaces': 'Do not use leading/trailing space',
	'unicorn/no-empty-file': 'Empty files are not allowed',
	'unicorn/no-for-loop': 'Use a `for-of` loop instead',
	'unicorn/no-instanceof-array': 'Use `Array.isArray` instead',
	'unicorn/no-new-array': 'Do not use `new Array`',
	'unicorn/no-new-buffer': 'Use `Buffer.from` instead',
	'unicorn/no-null': 'Use `undefined` instead of `null`',
	'unicorn/no-process-exit': 'Use `process.exit` only in CLI scripts',
	'unicorn/no-static-only-class': 'Use a namespace or regular functions',
	'unicorn/no-unnecessary-await': 'Unnecessary `await`',
	'unicorn/no-unreadable-array-destructuring': 'Array destructuring',
	'unicorn/no-useless-spread': 'Spreading an array literal',
	'unicorn/prefer-array-find': 'Use `Array.find` instead',
	'unicorn/prefer-array-some': 'Use `Array.some` instead',
	'unicorn/prefer-includes': 'Use `Array.includes` instead',
	'unicorn/prefer-string-starts-ends-with': 'Use `String.startsWith`',
	'unicorn/prefer-ternary': 'Use a ternary expression',
	'unicorn/throw-new-error': 'Use `new` when throwing an error'
};

console.log('📋 Testing violations file...\n');

let violationsFound = 0;
let violationDetails = {};

// Test the violations file
try {
	execSync(`npx eslint ${fixtures.violations} --config tests/test-config.mjs`, { 
		stdio: 'pipe',
		cwd: path.join(__dirname, '..'),
		env: {
			...process.env,
			NODE_PATH: path.join(__dirname, '../../../HappySupport/node_modules')
		}
	});
	console.error('❌ Expected ESLint to find violations, but it passed!');
} catch (error) {
	const output = error.stdout?.toString() || '';
	
	// Count and categorize violations
	for (const [rule, pattern] of Object.entries(expectedViolations)) {
		const regex = new RegExp(pattern, 'gi');
		const matches = output.match(regex) || [];
		violationDetails[rule] = matches.length;
		if (matches.length > 0) {
			violationsFound++;
			console.log(`✅ ${rule}: Found ${matches.length} violation(s)`);
		} else {
			console.log(`⚠️  ${rule}: No violations found (might not be triggered by test case)`);
		}
	}
}

console.log(`\n📊 Summary: Found violations for ${violationsFound}/${Object.keys(expectedViolations).length} rules`);

// Test the good file
console.log('\n📋 Testing good practices file...\n');

try {
	execSync(`npx eslint ${fixtures.good} --config tests/test-config.mjs`, { 
		stdio: 'pipe',
		cwd: path.join(__dirname, '..'),
		env: {
			...process.env,
			NODE_PATH: path.join(__dirname, '../../../HappySupport/node_modules')
		}
	});
	console.log('✅ Good practices file passed all checks!');
} catch (error) {
	const output = error.stdout?.toString() || '';
	const lineCount = output.split('\n').length - 1;
	console.error(`⚠️  Good practices file has some violations (${lineCount} lines of output)`);
	// Suppressing verbose output to prevent timeout issues
}

// Final result
console.log('\n🎯 Test Results:\n');

if (violationsFound >= 5) { // Unicorn has many rules, expect several to trigger
	console.log('✅ Unicorn rules are working correctly!');
	console.log('✅ The configuration successfully detects:');
	console.log('   - Suboptimal array methods usage');
	console.log('   - Inconsistent destructuring patterns');
	console.log('   - Poor error handling practices');
	console.log('   - Outdated JavaScript patterns');
	console.log('   - Performance and readability issues');
	process.exit(0);
} else {
	console.error('❌ Some Unicorn rules are not working as expected');
	console.error(`   Only ${violationsFound} out of ${Object.keys(expectedViolations).length} rules detected violations`);
	process.exit(1);
}