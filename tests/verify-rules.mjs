#!/usr/bin/env node

const { ESLint } = require('eslint');
const path = require('path');
const fs = require('fs');

// Import the config function
const eslintConfig = require('../eslint.config.mjs').default;

async function testRules() {
	console.log('🧪 Verifying ESLint Rules\n');

	// Create ESLint instance with our config
	const eslint = new ESLint({
		overrideConfigFile: false,
		baseConfig: eslintConfig({
			tsconfigPath: path.join(__dirname, 'tsconfig.json')
		})[1], // Get the main config object (skip ignores)
		cwd: path.dirname(__dirname)
	});

	// Test cases for complexity rules
	const complexityTests = [
		{
			name: 'High Cyclomatic Complexity',
			code: `
function complex(x) {
	if (x > 0) {
		if (x > 10) {
			if (x > 20) {
				if (x > 30) {
					if (x > 40) {
						if (x > 50) {
							if (x > 60) {
								if (x > 70) {
									if (x > 80) {
										if (x > 90) {
											return 'very high';
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return 'low';
}`,
			expectedRule: 'complexity'
		},
		{
			name: 'Too Many Parameters',
			code: `function tooManyParams(a, b, c, d, e) { return a + b + c + d + e; }`,
			expectedRule: 'max-params'
		},
		{
			name: 'Deep Nesting',
			code: `
function deepNest() {
	if (true) {
		if (true) {
			if (true) {
				if (true) {
					console.log('too deep');
				}
			}
		}
	}
}`,
			expectedRule: 'max-depth'
		},
		{
			name: 'Magic Numbers',
			code: `const timeout = 5000;`,
			expectedRule: 'no-magic-numbers'
		},
		{
			name: 'Using Any',
			code: `function useAny(data: any) { return data; }`,
			expectedRule: '@typescript-eslint/no-explicit-any'
		},
		{
			name: 'Parameter Reassignment',
			code: `function reassign(x) { x = x + 1; return x; }`,
			expectedRule: 'no-param-reassign'
		}
	];

	// Test cases for safety rules
	const safetyTests = [
		{
			name: 'Floating Promise',
			code: `async function test() { fetch('/api'); }`,
			expectedRule: '@typescript-eslint/no-floating-promises'
		},
		{
			name: 'No Await in Async',
			code: `async function noAwait() { return 'test'; }`,
			expectedRule: 'require-await'
		},
		{
			name: 'Using ==',
			code: `if (x == 5) { }`,
			expectedRule: 'eqeqeq'
		},
		{
			name: 'Using var',
			code: `var x = 5;`,
			expectedRule: 'no-var'
		},
		{
			name: 'Not Using Const',
			code: `let x = 5; console.log(x);`,
			expectedRule: 'prefer-const'
		},
		{
			name: 'No Curly Braces',
			code: `if (true) console.log('test');`,
			expectedRule: 'curly'
		},
		{
			name: 'Console Log',
			code: `console.log('test');`,
			expectedRule: 'no-console'
		},
		{
			name: 'Using eval',
			code: `eval('console.log("test")');`,
			expectedRule: 'no-eval'
		}
	];

	console.log('📋 Testing Complexity Rules:\n');
	let complexityPassed = 0;
	
	for (const test of complexityTests) {
		try {
			const results = await eslint.lintText(test.code, { 
				filePath: 'test.ts'
			});
			
			const violations = results[0]?.messages || [];
			const foundRule = violations.some(v => v.ruleId === test.expectedRule);
			
			if (foundRule) {
				console.log(`✅ ${test.name}: Detected by ${test.expectedRule}`);
				complexityPassed++;
			} else {
				console.log(`❌ ${test.name}: Not detected (expected ${test.expectedRule})`);
				if (violations.length > 0) {
					console.log(`   Found: ${violations.map(v => v.ruleId).join(', ')}`);
				}
			}
		} catch (error) {
			console.log(`❌ ${test.name}: Error - ${error.message}`);
		}
	}

	console.log(`\n📊 Complexity Rules: ${complexityPassed}/${complexityTests.length} passed\n`);

	console.log('📋 Testing Safety Rules:\n');
	let safetyPassed = 0;
	
	for (const test of safetyTests) {
		try {
			const results = await eslint.lintText(test.code, { 
				filePath: 'test.ts'
			});
			
			const violations = results[0]?.messages || [];
			const foundRule = violations.some(v => v.ruleId === test.expectedRule);
			
			if (foundRule) {
				console.log(`✅ ${test.name}: Detected by ${test.expectedRule}`);
				safetyPassed++;
			} else {
				console.log(`❌ ${test.name}: Not detected (expected ${test.expectedRule})`);
				if (violations.length > 0) {
					console.log(`   Found: ${violations.map(v => v.ruleId).join(', ')}`);
				}
			}
		} catch (error) {
			console.log(`❌ ${test.name}: Error - ${error.message}`);
		}
	}

	console.log(`\n📊 Safety Rules: ${safetyPassed}/${safetyTests.length} passed\n`);

	// Overall results
	const totalPassed = complexityPassed + safetyPassed;
	const totalTests = complexityTests.length + safetyTests.length;
	
	console.log('🎯 Overall Results:');
	console.log(`Total: ${totalPassed}/${totalTests} tests passed`);
	
	if (totalPassed === totalTests) {
		console.log('\n✅ All rules are working correctly!');
		process.exit(0);
	} else {
		console.log('\n❌ Some rules are not working as expected');
		process.exit(1);
	}
}

// Run the tests
testRules().catch(error => {
	console.error('Fatal error:', error);
	process.exit(1);
});