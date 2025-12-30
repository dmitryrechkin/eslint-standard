#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing ESLint Standard CLI Commands\n');

const cliPath = path.join(__dirname, '../src/cli/index.mjs');
const testDir = path.join(__dirname, 'test-install');

// Clean up test directory if it exists
if (fs.existsSync(testDir)) {
	fs.rmSync(testDir, { recursive: true, force: true });
}

// Create test directory
fs.mkdirSync(testDir);

// Create a minimal package.json
const testPackageJson = {
	name: 'test-eslint-standard-install',
	version: '1.0.0',
	description: 'Test package for ESLint Standard CLI',
	devDependencies: {}
};

fs.writeFileSync(
	path.join(testDir, 'package.json'),
	JSON.stringify(testPackageJson, null, 2)
);

console.log('📁 Created test directory:', testDir);

let failedTests = 0;

// Test 1: Help command
console.log('\n📋 Test 1: Help command');
try {
	const helpOutput = execFileSync('node', [cliPath, 'help'], { encoding: 'utf8' });
	console.log('✅ Help command works');
	// console.log(helpOutput.substring(0, 100) + '...');
} catch (error) {
	console.error('❌ Help command failed:', error.message);
	failedTests++;
}

// Test 2: Check dependencies (should find missing)
console.log('\n🔍 Test 2: Check dependencies in test directory');
try {
	execFileSync('node', [cliPath, 'check-deps'], {
		cwd: testDir,
		encoding: 'utf8',
		stdio: 'pipe' // capture output to verify failure
	});
	console.error('❌ Expected check-deps to fail with missing dependencies');
	failedTests++;
} catch (error) {
	if (error.status === 1) {
		console.log('✅ Correctly detected missing dependencies');
		// console.log(error.stdout.substring(0, 200) + '...');
	} else {
		console.error('❌ Unexpected error:', error.message);
		failedTests++;
	}
}

// Test 3: Lint command with error message
console.log('\n🧹 Test 3: Lint command with error message');
const lintTestDir = path.join(__dirname, 'test-lint-msg');
if (fs.existsSync(lintTestDir)) {
    fs.rmSync(lintTestDir, { recursive: true, force: true });
}
fs.mkdirSync(lintTestDir);

// Create a file with a linting error (using var)
// We need a basic eslint config to make sure it runs
const eslintConfig = `
export default [
    {
        files: ["**/*.js"],
        rules: {
            "no-var": "error"
        }
    }
];
`;
fs.writeFileSync(path.join(lintTestDir, 'eslint.config.js'), eslintConfig);
fs.writeFileSync(path.join(lintTestDir, 'bad-code.js'), 'var a = 1;');

try {
    // Run the lint command on the directory
    // We expect it to fail
    execFileSync('node', [cliPath, 'lint', '.'], {
        cwd: lintTestDir,
        encoding: 'utf8',
        stdio: 'pipe'
    });
    console.error('❌ Expected lint command to fail');
    failedTests++;
} catch (error) {
    if (error.status !== 0) {
        // Check stdout/stderr for the specific message
        const output = (error.stdout || '') + (error.stderr || '');
        const expectedMessage = 'please address all the errors and warnings and re-run linting after, make sure everything builds and all tests pass after modifying the code';

        if (output.includes(expectedMessage)) {
            console.log('✅ Found expected error message');
        } else {
            console.error('❌ Did not find expected error message');
            console.error('Output was:', output);
            failedTests++;
        }
    } else {
        console.error('❌ Unexpected successful exit code');
        failedTests++;
    }
}

// Clean up
console.log('\n🧹 Cleaning up test directories...');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
if (fs.existsSync(lintTestDir)) fs.rmSync(lintTestDir, { recursive: true, force: true });

if (failedTests > 0) {
    console.log(`\n❌ ${failedTests} tests failed`);
    process.exit(1);
} else {
    console.log('\n✅ All CLI tests completed!');
}
