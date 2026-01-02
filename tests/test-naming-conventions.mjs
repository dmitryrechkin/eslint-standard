#!/usr/bin/env node

/**
 * Test Naming Conventions
 *
 * Verifies that @typescript-eslint/naming-convention rule correctly enforces
 * naming conventions, especially for objectLiteralProperty selector.
 *
 * Tests the fix for selector order bug where memberLike was preventing
 * objectLiteralProperty from being evaluated.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ESLINT_CONFIG = path.join(__dirname, 'naming-conventions-config.mjs');

const testDir = path.join(__dirname, 'naming-conventions-temp');

/**
 * Cleans up temporary test directory.
 */
function cleanup() {
	if (fs.existsSync(testDir)) {
		fs.rmSync(testDir, { recursive: true, force: true });
	}
}

/**
 * Runs ESLint on a test file and returns filtered results.
 */
function lintFile(filePath) {
	try {
		const stdout = execFileSync(
			'npx',
			['eslint', '--config', ESLINT_CONFIG, '--format=json', filePath],
			{
				cwd: __dirname,
				encoding: 'utf-8'
			}
		);
		return JSON.parse(stdout);
	} catch (error) {
		// ESLint returns non-zero exit code when errors are found
		const stdout = error.stdout;
		if (stdout) {
			return JSON.parse(stdout);
		}
		throw error;
	}
}

/**
 * Extracts naming convention violations from ESLint results.
 */
function getNamingViolations(results, filePath) {
	const fileResult = results.find(r => r.filePath === filePath);
	if (!fileResult) return [];

	return fileResult.messages.filter(
		m => m.ruleId === '@typescript-eslint/naming-convention'
	);
}

/**
 * Runs comprehensive naming convention tests.
 */
async function runTests() {
	console.log('🧪 Naming Convention Regression Tests\n');
	console.log('=' .repeat(60));

	cleanup();
	fs.mkdirSync(testDir, { recursive: true });

	let passedTests = 0;
	let failedTests = 0;

	// Test cases
	const tests = [
		// === Object Literal Property Tests ===
		{
			name: 'Object literal - Valid: camelCase property',
			path: 'valid-camelCase-object.ts',
			content: `
				const config = {
					maxTokens: 100,
					toolChoice: 'auto'
				};
			`,
			expectedViolations: 0,
			description: 'camelCase properties should be allowed'
		},
		{
			name: 'Object literal - Valid: UPPER_CASE property',
			path: 'valid-upperCase-object.ts',
			content: `
				const CONSTANTS = {
					MAX_TOKENS: 100,
					DEFAULT_MODEL: 'claude-3'
				};
			`,
			expectedViolations: 0,
			description: 'UPPER_CASE properties should be allowed'
		},
		{
			name: 'Object literal - Invalid: snake_case property',
			path: 'invalid-snakeCase-object.ts',
			content: `
				const config = {
					max_tokens: 100,
					tool_choice: 'auto'
				};
			`,
			expectedViolations: 2,
			description: 'snake_case properties should be flagged (THE BUG WE FIXED)'
		},
		{
			name: 'Object literal - Mixed: valid and invalid',
			path: 'mixed-naming-object.ts',
			content: `
				const config = {
					model: 'claude-3',        // valid: camelCase
					max_tokens: 100,          // invalid: snake_case
					temperature: 0.5,         // valid: camelCase
					top_k: 10                 // invalid: snake_case
				};
			`,
			expectedViolations: 2,
			description: 'Should catch only snake_case properties'
		},

		// === Variable Tests ===
		{
			name: 'Variable - Valid: camelCase',
			path: 'valid-camelCase-var.ts',
			content: 'const myVariable = 100;',
			expectedViolations: 0,
			description: 'camelCase variables should be allowed'
		},
		{
			name: 'Variable - Valid: UPPER_CASE const',
			path: 'valid-upperCase-var.ts',
			content: 'const MAX_VALUE = 100;',
			expectedViolations: 0,
			description: 'UPPER_CASE const variables should be allowed'
		},
		{
			name: 'Variable - Invalid: snake_case',
			path: 'invalid-snakeCase-var.ts',
			content: 'const max_tokens_value = 100;',
			expectedViolations: 1,
			description: 'snake_case variables should be flagged'
		},

		// === Interface Tests ===
		{
			name: 'Interface - Valid: Type prefix',
			path: 'valid-type-interface.ts',
			content: 'export interface TypeUser { id: string; }',
			expectedViolations: 0,
			description: 'Type prefix interfaces should be allowed'
		},
		{
			name: 'Interface - Valid: Interface suffix',
			path: 'valid-interface-suffix.ts',
			content: 'export interface UserInterface { id: string; }',
			expectedViolations: 0,
			description: 'Interface suffix should be allowed'
		},
		{
			name: 'Interface - Invalid: no prefix/suffix',
			path: 'invalid-interface.ts',
			content: 'export interface User { id: string; }',
			expectedViolations: 1,
			description: 'Interface without Type prefix or Interface suffix should be flagged'
		},

		// === Function Tests ===
		{
			name: 'Function - Valid: camelCase',
			path: 'valid-camelCase-function.ts',
			content: 'function getUserData() {}',
			expectedViolations: 0,
			description: 'camelCase function names should be allowed'
		},
		{
			name: 'Function - Invalid: snake_case',
			path: 'invalid-snakeCase-function.ts',
			content: 'function get_user_data() {}',
			expectedViolations: 1,
			description: 'snake_case function names should be flagged'
		}
	];

	// Run each test
	for (const test of tests) {
		console.log(`\n📋 ${test.name}`);
		console.log(`   ${test.description}`);
		console.log('-'.repeat(60));

		// Create test file
		const testFilePath = path.join(testDir, test.path);
		fs.mkdirSync(path.dirname(testFilePath), { recursive: true });
		fs.writeFileSync(testFilePath, test.content);

		// Run ESLint
		const results = lintFile(testFilePath);
		const violations = getNamingViolations(results, testFilePath);

		// Check results
		if (violations.length === test.expectedViolations) {
			console.log(`   ✅ PASSED - Found ${violations.length} violations`);
			passedTests++;
		} else {
			console.log(`   ❌ FAILED - Expected ${test.expectedViolations} violations, got ${violations.length}`);
			if (violations.length > 0) {
				console.log('   Violations:');
				violations.forEach(v => {
					console.log(`     - Line ${v.line}: ${v.message}`);
				});
			}
			failedTests++;
		}
	}

	// Summary
	console.log('\n' + '='.repeat(60));
	console.log(`\n📊 Test Summary`);
	console.log(`✅ Passed: ${passedTests}`);
	console.log(`❌ Failed: ${failedTests}`);
	console.log(`📈 Total:  ${tests.length} tests`);
	console.log('');

	if (failedTests > 0) {
		console.log('❌ Some tests failed!');
		process.exit(1);
	} else {
		console.log('✅ All tests passed!');
	}

	// Cleanup
	cleanup();
}

runTests().catch(error => {
	console.error('❌ Test suite error:', error);
	cleanup();
	process.exit(1);
});
