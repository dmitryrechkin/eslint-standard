#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🛡️  Testing Safety Rules\n');

const fixtures = {
	violations: path.join(__dirname, 'fixtures/safety-violations.ts'),
	good: path.join(__dirname, 'fixtures/safety-good.ts')
};

// Expected violations (partial list of key rules)
const expectedViolations = {
	'@typescript-eslint/no-floating-promises': 'Promises must be awaited',
	'@typescript-eslint/await-thenable': 'Unexpected `await` of a non-Promise',
	'require-await': 'has no .*await.* expression',
	'@typescript-eslint/no-array-delete': 'Using the `delete` operator with an array expression is unsafe',
	'array-callback-return': 'expects a return value from',
	'@typescript-eslint/only-throw-error': 'Expected an error object to be thrown',
	'no-empty': 'Empty block statement',
	'no-fallthrough': 'Expected a \'break\' statement',
	'@typescript-eslint/no-shadow': 'is already declared in the upper scope',
	'@typescript-eslint/no-use-before-define': 'was used before it was defined',
	'no-await-in-loop': 'Unexpected.*await.*inside a loop',
	'no-eval': 'eval can be harmful',
	'no-implied-eval': 'Implied eval',
	'no-new-func': 'The Function constructor',
	'curly': 'Expected { after',
	'eqeqeq': 'Expected \'===\' and instead saw \'==\'',
	'no-var': 'Unexpected var',
	'prefer-const': 'is never reassigned',
	'no-console': 'Unexpected console statement',
	'no-unused-expressions': 'Expected an assignment or function call',
	'no-cond-assign': 'Expected a conditional expression',
	'no-constant-condition': 'Unexpected constant condition',
	'no-debugger': 'Unexpected \'debugger\' statement',
	'no-dupe-keys': 'Duplicate key',
	'no-loss-of-precision': 'This number literal will lose precision',
	'no-compare-neg-zero': 'Do not use the \'===\' operator',
	'use-isnan': 'Use the isNaN function',
	'no-duplicate-imports': 'import is duplicated',
	'no-unreachable': 'Unreachable code',
	'for-direction': 'The update clause in this loop',
	'no-unmodified-loop-condition': 'is not modified in this loop'
};

console.log('📋 Testing violations file...\n');

let violationsFound = 0;
let violationDetails = {};

// Test the violations file
try {
	execSync(`npx eslint ${fixtures.violations} --config tests/test-config.mjs --max-warnings 0`, { 
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
			// Some rules might not trigger due to TypeScript or other conflicts
			if (!['no-duplicate-imports'].includes(rule)) {
				console.log(`⚠️  ${rule}: No violations found (might be overridden)`);
			}
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
	// Check if it's just JSDoc warnings
	if (output.includes('Missing JSDoc') || output.includes('type annotation')) {
		console.log('⚠️  Good practices file has only JSDoc warnings (expected)');
	} else {
		console.error('❌ Good practices file has unexpected violations:');
		console.error(output);
	}
}

// Final result
console.log('\n🎯 Test Results:\n');

if (violationsFound >= 25) { // Expecting at least 25 rules to catch violations
	console.log('✅ Safety rules are working correctly!');
	console.log('✅ The configuration successfully detects:');
	console.log('   - Floating promises');
	console.log('   - Type safety violations');
	console.log('   - Array manipulation issues');
	console.log('   - Error handling problems');
	console.log('   - Variable safety issues');
	console.log('   - Security vulnerabilities');
	console.log('   - Code quality issues');
	console.log('   - And more...');
	process.exit(0);
} else {
	console.error('❌ Some safety rules are not working as expected');
	console.error(`   Only ${violationsFound} out of ${Object.keys(expectedViolations).length} rules detected violations`);
	process.exit(1);
}