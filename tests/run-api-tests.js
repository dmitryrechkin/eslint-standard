#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Running ESLint API Tests\n');
console.log('=' .repeat(50));

async function runTest(scriptPath, name) {
	return new Promise((resolve) => {
		console.log(`\n📌 Running ${name}...`);
		console.log('-'.repeat(50));
		
		const child = spawn('node', [scriptPath], {
			stdio: 'inherit',
			cwd: path.dirname(scriptPath)
		});
		
		child.on('close', (code) => {
			console.log('\n' + '='.repeat(50));
			resolve(code === 0);
		});
	});
}

async function main() {
	const tests = [
		{ script: 'verify-rules.js', name: 'Quick Rule Verification' },
		{ script: 'test-complexity-api.js', name: 'Complexity Rules Test' },
		{ script: 'test-safety-api.js', name: 'Safety Rules Test' }
	];
	
	const results = [];
	
	for (const test of tests) {
		const passed = await runTest(path.join(__dirname, test.script), test.name);
		results.push({ name: test.name, passed });
	}
	
	// Summary
	console.log('\n📊 Test Summary\n');
	console.log('Test'.padEnd(40) + 'Status');
	console.log('-'.repeat(50));
	
	let allPassed = true;
	for (const result of results) {
		const status = result.passed ? '✅ PASSED' : '❌ FAILED';
		console.log(result.name.padEnd(40) + status);
		if (!result.passed) allPassed = false;
	}
	
	console.log('-'.repeat(50));
	console.log(`Total: ${results.filter(r => r.passed).length}/${results.length} passed`);
	
	if (allPassed) {
		console.log('\n🎉 All tests passed!');
		process.exit(0);
	} else {
		console.log('\n❌ Some tests failed.');
		process.exit(1);
	}
}

main().catch(error => {
	console.error('Fatal error:', error);
	process.exit(1);
});