#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Complexity Rules\n');

const fixtures = {
	violations: path.join(__dirname, 'fixtures/complexity-violations.ts'),
	good: path.join(__dirname, 'fixtures/complexity-good.ts')
};

// Expected violations
const expectedViolations = {
	'complexity': 'has a complexity of',
	'max-lines-per-function': 'has too many lines',
	'max-statements': 'has too many statements',
	'max-params': 'has too many parameters',
	'max-depth': 'nested too deeply',
	'max-nested-callbacks': 'Too many nested callbacks',
	'max-len': 'This line has a length of',
	'no-magic-numbers': 'No magic number',
	'@typescript-eslint/no-explicit-any': 'Unexpected any',
	'no-param-reassign': 'Assignment to function parameter',
	'no-else-return': 'Unnecessary \'else\' after \'return\'',
	'no-nested-ternary': 'Do not nest ternary expressions'
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
	for (const [rule, message] of Object.entries(expectedViolations)) {
		const regex = new RegExp(message, 'gi');
		const matches = output.match(regex) || [];
		violationDetails[rule] = matches.length;
		if (matches.length > 0) {
			violationsFound++;
			console.log(`✅ ${rule}: Found ${matches.length} violation(s)`);
		} else {
			console.log(`❌ ${rule}: No violations found (expected at least 1)`);
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
	console.error('❌ Good practices file has violations:');
	console.error(output);
}

// Final result
console.log('\n🎯 Test Results:\n');

if (violationsFound >= 10) { // Expecting at least 10 rules to catch violations
	console.log('✅ Complexity rules are working correctly!');
	console.log('✅ The configuration successfully detects:');
	console.log('   - High cyclomatic complexity');
	console.log('   - Long functions');
	console.log('   - Deep nesting');
	console.log('   - Too many parameters');
	console.log('   - Magic numbers');
	console.log('   - Any type usage');
	console.log('   - And more...');
	process.exit(0);
} else {
	console.error('❌ Some complexity rules are not working as expected');
	console.error(`   Only ${violationsFound} out of ${Object.keys(expectedViolations).length} rules detected violations`);
	process.exit(1);
}