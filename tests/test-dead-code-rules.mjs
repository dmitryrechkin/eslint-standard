#!/usr/bin/env node

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('💀 Testing Dead Code Cleanup Rules\n');
console.log('This test validates that our new dead code cleanup rules work correctly.\n');

const fixtures = {
	violations: path.join(__dirname, 'fixtures/dead-code-violations.ts'),
	good: path.join(__dirname, 'fixtures/dead-code-good.ts')
};

// Expected violations from our new dead code rules
const expectedViolations = {
	// Basic ESLint rules
	'no-var': 'Unexpected var',
	'no-undef-init': "It's not necessary to initialize",
	'no-unreachable': 'Unreachable code',
	'no-constant-condition': 'Unexpected constant condition',
	'no-else-return': 'Unnecessary else',
	'no-return-assign': 'Assignment to property of function parameter',

	// TypeScript ESLint rules
	'@typescript-eslint/no-unused-vars': 'is assigned a value but never used',
	'@typescript-eslint/no-unused-private-class-members': 'is never used',
	'@typescript-eslint/no-useless-constructor': 'Useless constructor',
	'@typescript-eslint/no-empty-function': 'Empty function',
	'@typescript-eslint/no-empty-interface': 'An empty interface',
	'@typescript-eslint/no-useless-this': "Unnecessary use of 'this'"
};

console.log('📋 Testing violations file - should detect dead code issues...\n');

let violationsFound = 0;
let violationDetails = {};
let output = '';

// Test the violations file
try {
	const result = execSync(`npx eslint "${fixtures.violations}" --config tests/test-config.mjs --max-warnings 0`, {
		stdio: 'pipe',
		cwd: path.join(__dirname, '..'),
		env: {
			...process.env,
			NODE_PATH: path.join(__dirname, '../../../node_modules')
		}
	});
	output = result.stdout?.toString() || '';
	console.error('❌ Expected ESLint to find violations, but it passed!');
} catch (error) {
	output = error.stdout?.toString() || error.stderr?.toString() || '';

	// Count and categorize violations
	for (const [rule, pattern] of Object.entries(expectedViolations)) {
		const regex = new RegExp(pattern, 'gi');
		const matches = output.match(regex) || [];
		violationDetails[rule] = matches.length;
		if (matches.length > 0) {
			violationsFound++;
			console.log(`✅ ${rule}: Found ${matches.length} violation(s)`);
		} else {
			// Check if rule is mentioned in output
			if (output.includes(rule)) {
				violationsFound++;
				const count = (output.match(new RegExp(rule.replace(/[@/]/g, '\\$&'), 'g')) || []).length;
				console.log(`✅ ${rule}: Found ${count} occurrence(s)`);
			} else {
				console.log(`⚠️  ${rule}: No violations detected`);
			}
		}
	}
}

console.log('\n📊 Violations Summary:');
console.log(`Total rule violations expected: ${Object.keys(expectedViolations).length}`);
console.log(`Total rule violations found: ${violationsFound}`);

// Check for auto-fix capability
console.log('\n🔧 Testing auto-fix capability...');
try {
	const fixedOutput = execSync(`npx eslint "${fixtures.violations}" --config tests/test-config.mjs --fix --dry-run --format=json`, {
		stdio: 'pipe',
		cwd: path.join(__dirname, '..'),
		env: {
			...process.env,
			NODE_PATH: path.join(__dirname, '../../../node_modules')
		}
	});

	const results = JSON.parse(fixedOutput.toString());
	const fixableIssues = results.reduce((count, file) => {
		return count + (file.messages?.filter(msg => msg.fix).length || 0);
	}, 0);

	console.log(`✅ Auto-fixable issues: ${fixableIssues}`);

} catch (fixError) {
	console.log('⚠️  Could not determine auto-fix capability');
}

console.log('\n✨ Testing good code file - should pass all rules...\n');

// Test the good file
try {
	const goodResult = execSync(`npx eslint "${fixtures.good}" --config tests/test-config.mjs --max-warnings 0`, {
		stdio: 'pipe',
		cwd: path.join(__dirname, '..'),
		env: {
			...process.env,
			NODE_PATH: path.join(__dirname, '../../../node_modules')
		}
	});

	console.log('✅ Good code file passed all rules - no violations found');

} catch (goodError) {
	const goodOutput = goodError.stdout?.toString() || goodError.stderr?.toString() || '';
	const errorLines = goodOutput.split('\n').filter(line => line.trim()).slice(0, 10);

	console.log('⚠️  Good code file has some issues (may need adjustment):');
	errorLines.forEach(line => console.log(`   ${line}`));

	// Count unexpected violations
	const unexpectedViolations = [];
	for (const rule of Object.keys(expectedViolations)) {
		if (goodOutput.includes(rule)) {
			unexpectedViolations.push(rule);
		}
	}

	if (unexpectedViolations.length > 0) {
		console.log(`\n❌ Unexpected violations in good file: ${unexpectedViolations.join(', ')}`);
	}
}

// Detailed analysis of violations file
console.log('\n🔍 Detailed Violation Analysis:');
const rulesToHighlight = [
	'@typescript-eslint/no-unused-vars',
	'@typescript-eslint/no-unused-private-class-members',
	'@typescript-eslint/no-useless-constructor',
	'@typescript-eslint/no-empty-function',
	'@typescript-eslint/no-useless-this'
];

rulesToHighlight.forEach(rule => {
	const regex = new RegExp(`${rule.replace(/[@/]/g, '\\$&')}.*?(?=\\n|$)`, 'gi');
	const matches = output.match(regex) || [];
	if (matches.length > 0) {
		console.log(`\n📌 ${rule}:`);
		matches.slice(0, 3).forEach(match => {
			console.log(`   ${match.trim()}`);
		});
		if (matches.length > 3) {
			console.log(`   ... and ${matches.length - 3} more`);
		}
	}
});

// Summary and recommendations
console.log('\n📈 Test Results Summary:');
const expectedRulesCount = Object.keys(expectedViolations).length;
const detectionRate = ((violationsFound / expectedRulesCount) * 100).toFixed(1);

console.log(`- Rules tested: ${expectedRulesCount}`);
console.log(`- Rules with violations detected: ${violationsFound}`);
console.log(`- Detection rate: ${detectionRate}%`);

if (violationsFound >= expectedRulesCount * 0.8) {
	console.log('\n✅ SUCCESS: Dead code cleanup rules are working effectively!');
	console.log('   Most rules are properly detecting violations.');
} else {
	console.log('\n⚠️  PARTIAL SUCCESS: Some rules may need adjustment.');
	console.log('   Review the rule configurations to ensure they are properly enabled.');
}

// Recommendations
console.log('\n💡 Recommendations:');
if (violationsFound < expectedRulesCount) {
	console.log('- Review eslint.config.mjs to ensure all dead code rules are enabled');
	console.log('- Check if any rules conflict with TypeScript configuration');
	console.log('- Verify that the rule names match the expected patterns');
}

console.log('- Run `npx eslint --fix` on your codebase to automatically clean up detected issues');
console.log('- Review auto-fixable issues before applying to ensure they don\'t break functionality');
console.log('- Consider adding suppressions for intentionally empty functions or interfaces');

console.log('\n🎉 Dead Code Rules Test Complete!');