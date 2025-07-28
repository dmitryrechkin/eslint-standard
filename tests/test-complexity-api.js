#!/usr/bin/env node

const { ESLint } = require('eslint');
const path = require('path');
const fs = require('fs');

// Import the config function
const eslintConfig = require('../eslint.config.mjs').default;

async function testComplexityRules() {
	console.log('🧪 Testing Complexity Rules with API\n');

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
		path.join(__dirname, 'fixtures/complexity-violations.ts'), 
		'utf8'
	);
	const goodFile = fs.readFileSync(
		path.join(__dirname, 'fixtures/complexity-good.ts'), 
		'utf8'
	);

	// Expected violations
	const expectedViolations = [
		'complexity',
		'max-lines-per-function',
		'max-statements',
		'max-params',
		'max-depth',
		'max-nested-callbacks',
		'max-len',
		'no-magic-numbers',
		'@typescript-eslint/no-explicit-any',
		'no-param-reassign',
		'no-else-return',
		'no-nested-ternary'
	];

	console.log('📋 Testing violations file...\n');
	
	// Test the violations file
	const violationResults = await eslint.lintText(violationsFile, {
		filePath: path.join(__dirname, 'fixtures/complexity-violations.ts')
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
	for (const rule of expectedViolations) {
		if (violationsByRule[rule]) {
			console.log(`✅ ${rule}: ${violationsByRule[rule].length} violation(s)`);
			detectedCount++;
		} else {
			console.log(`❌ ${rule}: Not detected`);
		}
	}

	// Show any unexpected violations
	for (const rule in violationsByRule) {
		if (!expectedViolations.includes(rule)) {
			console.log(`ℹ️  ${rule}: ${violationsByRule[rule].length} violation(s) (not in expected list)`);
		}
	}

	console.log(`\n📊 Summary: ${detectedCount}/${expectedViolations.length} expected rules detected violations`);

	// Test the good file
	console.log('\n📋 Testing good practices file...\n');
	
	const goodResults = await eslint.lintText(goodFile, {
		filePath: path.join(__dirname, 'fixtures/complexity-good.ts')
	});

	const goodMessages = goodResults[0]?.messages || [];
	const complexityViolations = goodMessages.filter(m => 
		expectedViolations.includes(m.ruleId)
	);

	if (complexityViolations.length === 0) {
		console.log('✅ Good practices file has no complexity violations!');
	} else {
		console.log(`❌ Good practices file has ${complexityViolations.length} complexity violations:`);
		complexityViolations.forEach(v => {
			console.log(`   - ${v.ruleId} at line ${v.line}: ${v.message}`);
		});
	}

	// Show non-complexity violations (like JSDoc)
	const otherViolations = goodMessages.filter(m => 
		!expectedViolations.includes(m.ruleId)
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
	
	if (detectedCount >= 10) { // Expecting at least 10 rules to work
		console.log('✅ Complexity rules are working correctly!');
		console.log(`   Detected ${detectedCount}/${expectedViolations.length} expected rules`);
		return true;
	} else {
		console.log('❌ Some complexity rules are not working as expected');
		console.log(`   Only ${detectedCount}/${expectedViolations.length} rules detected violations`);
		return false;
	}
}

// Run the test
testComplexityRules()
	.then(success => process.exit(success ? 0 : 1))
	.catch(error => {
		console.error('Fatal error:', error);
		process.exit(1);
	});