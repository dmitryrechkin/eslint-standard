#!/usr/bin/env node

const { ESLint } = require('eslint');
const path = require('path');
const fs = require('fs');

// Import the config function
const eslintConfig = require('../eslint.config.mjs').default;

async function testSafetyRules() {
	console.log('🛡️  Testing Safety Rules with API\n');

	// Create ESLint instance with our config
	const eslint = new ESLint({
		overrideConfigFile: false,
		baseConfig: eslintConfig({
			tsconfigPath: path.join(__dirname, 'tsconfig.json')
		})[1], // Get the main config object (skip ignores)
		cwd: path.dirname(__dirname)
	});

	// Read the test files
	const violationsFile = fs.readFileSync(
		path.join(__dirname, 'fixtures/safety-violations.ts'), 
		'utf8'
	);
	const goodFile = fs.readFileSync(
		path.join(__dirname, 'fixtures/safety-good.ts'), 
		'utf8'
	);

	// Expected violations - group by category
	const expectedViolations = {
		// Promise safety
		'@typescript-eslint/no-floating-promises': 'Floating promise',
		'@typescript-eslint/await-thenable': 'Await non-promise',
		'require-await': 'Async without await',
		
		// Array safety
		'@typescript-eslint/no-array-delete': 'Array delete',
		'array-callback-return': 'Array callback no return',
		
		// Error handling
		'@typescript-eslint/no-throw-literal': 'Throw non-error',
		'no-empty': 'Empty catch',
		'no-fallthrough': 'Switch fallthrough',
		
		// Variable safety
		'@typescript-eslint/no-shadow': 'Variable shadowing',
		'@typescript-eslint/no-use-before-define': 'Use before define',
		'no-param-reassign': 'Parameter reassignment',
		
		// Loop safety
		'no-await-in-loop': 'Await in loop',
		'for-direction': 'Wrong loop direction',
		'no-unmodified-loop-condition': 'Unmodified loop condition',
		
		// Security
		'no-eval': 'Using eval',
		'no-implied-eval': 'Implied eval',
		'no-new-func': 'new Function',
		
		// Code quality
		'curly': 'No curly braces',
		'eqeqeq': 'Using ==',
		'no-var': 'Using var',
		'prefer-const': 'Not using const',
		'no-console': 'Console.log',
		'no-unused-expressions': 'Side-effect free',
		
		// Bug prevention
		'no-cond-assign': 'Assignment in condition',
		'no-constant-condition': 'Constant condition',
		'no-debugger': 'Debugger statement',
		'no-dupe-keys': 'Duplicate keys',
		'no-unreachable': 'Unreachable code',
		
		// Number safety
		'no-loss-of-precision': 'Loss of precision',
		'no-compare-neg-zero': 'Compare -0',
		'use-isnan': 'NaN comparison'
	};

	console.log('📋 Testing violations file...\n');
	
	// Test the violations file
	const violationResults = await eslint.lintText(violationsFile, {
		filePath: path.join(__dirname, 'fixtures/safety-violations.ts')
	});

	const foundViolations = new Set();
	const allMessages = violationResults[0]?.messages || [];
	
	console.log(`Found ${allMessages.length} total violations\n`);

	// Group violations by rule
	const violationsByRule = {};
	for (const message of allMessages) {
		if (!violationsByRule[message.ruleId]) {
			violationsByRule[message.ruleId] = [];
		}
		violationsByRule[message.ruleId].push(message);
		foundViolations.add(message.ruleId);
	}

	// Check each expected rule
	let detectedCount = 0;
	console.log('Expected violations detection:\n');
	
	for (const [rule, description] of Object.entries(expectedViolations)) {
		if (violationsByRule[rule]) {
			console.log(`✅ ${rule}: ${violationsByRule[rule].length} violation(s) - ${description}`);
			detectedCount++;
		} else {
			console.log(`❌ ${rule}: Not detected - ${description}`);
		}
	}

	// Show any unexpected violations
	console.log('\nOther violations found:');
	for (const rule in violationsByRule) {
		if (!expectedViolations[rule]) {
			console.log(`ℹ️  ${rule}: ${violationsByRule[rule].length} violation(s)`);
		}
	}

	console.log(`\n📊 Summary: ${detectedCount}/${Object.keys(expectedViolations).length} expected rules detected violations`);

	// Test the good file
	console.log('\n📋 Testing good practices file...\n');
	
	const goodResults = await eslint.lintText(goodFile, {
		filePath: path.join(__dirname, 'fixtures/safety-good.ts')
	});

	const goodMessages = goodResults[0]?.messages || [];
	const safetyViolations = goodMessages.filter(m => 
		Object.keys(expectedViolations).includes(m.ruleId)
	);

	if (safetyViolations.length === 0) {
		console.log('✅ Good practices file has no safety violations!');
	} else {
		console.log(`❌ Good practices file has ${safetyViolations.length} safety violations:`);
		safetyViolations.forEach(v => {
			console.log(`   - ${v.ruleId} at line ${v.line}: ${v.message}`);
		});
	}

	// Show non-safety violations (like JSDoc)
	const otherViolations = goodMessages.filter(m => 
		!Object.keys(expectedViolations).includes(m.ruleId)
	);
	if (otherViolations.length > 0) {
		console.log(`\nℹ️  Other violations (${otherViolations.length}):`);
		const ruleCount = {};
		otherViolations.forEach(v => {
			ruleCount[v.ruleId] = (ruleCount[v.ruleId] || 0) + 1;
		});
		Object.entries(ruleCount).forEach(([rule, count]) => {
			console.log(`   - ${rule}: ${count} violation(s)`);
		});
	}

	// Final result
	console.log('\n🎯 Test Results:\n');
	
	if (detectedCount >= 25) { // Expecting at least 25 rules to work
		console.log('✅ Safety rules are working correctly!');
		console.log(`   Detected ${detectedCount}/${Object.keys(expectedViolations).length} expected rules`);
		return true;
	} else {
		console.log('❌ Some safety rules are not working as expected');
		console.log(`   Only ${detectedCount}/${Object.keys(expectedViolations).length} rules detected violations`);
		return false;
	}
}

// Run the test
testSafetyRules()
	.then(success => process.exit(success ? 0 : 1))
	.catch(error => {
		console.error('Fatal error:', error);
		process.exit(1);
	});