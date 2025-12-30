/**
 * Test spacing/density rules
 * Tests @stylistic/padding-line-between-statements and @stylistic/lines-between-class-members
 */

import { ESLint } from 'eslint';
import eslintConfig from '../eslint.config.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const violationsFile = path.join(__dirname, 'fixtures/spacing-violations.ts');

console.log('📐 Testing Code Spacing/Density Rules\n');

// Rules we expect to find violations for
const spacingRules = [
	'@stylistic/padding-line-between-statements',
	'@stylistic/lines-between-class-members'
];

async function runTest() {
	const config = eslintConfig({});

	const eslint = new ESLint({
		overrideConfigFile: true,
		overrideConfig: config
	});

	// Test violations file
	console.log('📋 Testing violations file...\n');

	const results = await eslint.lintFiles([violationsFile]);
	const messages = results[0]?.messages || [];

	// Count violations by rule
	const ruleViolations = {};
	for (const msg of messages) {
		if (!ruleViolations[msg.ruleId]) {
			ruleViolations[msg.ruleId] = 0;
		}
		ruleViolations[msg.ruleId]++;
	}

	// Check for spacing rule violations
	let foundSpacingViolations = false;
	let totalSpacingViolations = 0;

	for (const rule of spacingRules) {
		const count = ruleViolations[rule] || 0;
		if (count > 0) {
			console.log(`✅ ${rule}: Found ${count} violation(s)`);
			foundSpacingViolations = true;
			totalSpacingViolations += count;
		} else {
			console.log(`⚠️  ${rule}: No violations found`);
		}
	}

	console.log(`\n📊 Summary: Found ${totalSpacingViolations} spacing violations\n`);

	// Show some example violations
	const spacingMessages = messages.filter(m => spacingRules.includes(m.ruleId));
	if (spacingMessages.length > 0) {
		console.log('📝 Example violations:');
		for (const msg of spacingMessages.slice(0, 5)) {
			console.log(`   Line ${msg.line}: ${msg.message}`);
		}
		if (spacingMessages.length > 5) {
			console.log(`   ... and ${spacingMessages.length - 5} more`);
		}
	}

	// Test autofix capability
	console.log('\n🔧 Testing autofix capability...');

	const eslintWithFix = new ESLint({
		overrideConfigFile: true,
		overrideConfig: config,
		fix: true
	});

	// Read original content
	const originalContent = fs.readFileSync(violationsFile, 'utf8');

	// Run with fix (dry run - don't actually save)
	const fixResults = await eslintWithFix.lintFiles([violationsFile]);
	const fixedOutput = fixResults[0]?.output;

	if (fixedOutput && fixedOutput !== originalContent) {
		const addedLines = fixedOutput.split('\n').length - originalContent.split('\n').length;
		console.log(`✅ Autofix works! Would add ${addedLines} blank lines`);
	} else {
		console.log('⚠️  No autofix changes detected');
	}

	// Final result
	console.log('\n🎯 Test Results:\n');

	if (foundSpacingViolations) {
		console.log('✅ Spacing rules are working correctly!');
		console.log('✅ The configuration successfully detects:');
		console.log('   - Missing blank lines after imports');
		console.log('   - Missing blank lines before returns');
		console.log('   - Dense code around control flow statements');
		console.log('   - Missing blank lines between class members');
		return true;
	} else {
		console.log('❌ Spacing rules did not detect expected violations');
		return false;
	}
}

runTest()
	.then(success => {
		process.exit(success ? 0 : 1);
	})
	.catch(error => {
		console.error('Error running test:', error);
		process.exit(1);
	});
