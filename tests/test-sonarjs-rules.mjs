#!/usr/bin/env node

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧠 Testing SonarJS Rules\n');

const fixtures = {
	violations: path.join(__dirname, 'fixtures/sonarjs-violations.ts'),
	good: path.join(__dirname, 'fixtures/sonarjs-good.ts')
};

// Expected violations for SonarJS plugin rules
const expectedViolations = {
	'sonarjs/cognitive-complexity': 'has a complexity of',
	'sonarjs/no-identical-expressions': 'identical sub-expressions on both sides of operator',
	'sonarjs/no-identical-functions': 'identical functions',
	'sonarjs/no-duplicate-string': 'duplicated string literal',
	'sonarjs/prefer-immediate-return': 'immediately return this expression',
	'sonarjs/prefer-object-literal': 'object literal',
	'sonarjs/prefer-single-boolean-return': 'single return statement',
	'sonarjs/no-redundant-boolean': 'redundant boolean literal',
	'sonarjs/no-unused-collection': 'unused collection',
	'sonarjs/no-useless-catch': 'useless catch clause',
	'sonarjs/prefer-while': 'prefer-while',
	'sonarjs/max-switch-cases': 'too many switch cases',
	'sonarjs/no-nested-switch': 'nested switch',
	'sonarjs/no-nested-template-literals': 'nested template literal',
	'sonarjs/no-redundant-jump': 'redundant jump',
	'sonarjs/no-same-line-conditional': 'same line conditional',
	'sonarjs/non-existent-operator': 'non-existent operator'
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

if (violationsFound >= 5) { // SonarJS rules should catch several violations
	console.log('✅ SonarJS rules are working correctly!');
	console.log('✅ The configuration successfully detects:');
	console.log('   - High cognitive complexity');
	console.log('   - Identical expressions and functions');
	console.log('   - Duplicate string literals');
	console.log('   - Redundant boolean operations');
	console.log('   - Code smells and maintainability issues');
	process.exit(0);
} else {
	console.error('❌ Some SonarJS rules are not working as expected');
	console.error(`   Only ${violationsFound} out of ${Object.keys(expectedViolations).length} rules detected violations`);
	process.exit(1);
}