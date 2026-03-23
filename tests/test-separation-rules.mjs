import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testDir = path.join(__dirname, 'separation-test-temp');

/**
 * Cleans up temporary test directory.
 * @returns {void} Nothing.
 */
function cleanup() {
	if (fs.existsSync(testDir)) {
		fs.rmSync(testDir, { recursive: true, force: true });
	}
}

/**
 * Runs separation rules tests.
 * @returns {Promise<void>} Resolves when tests complete.
 */
async function runTests() {
	cleanup();
	fs.mkdirSync(testDir);

	let passedCount = 0;
	let failedCount = 0;
	let allPassed = true;

	const testFiles = [
		{
			name: 'Class file with Schema (invalid)',
			path: 'ClassWithSchema.ts',
			content: `
import { z } from 'zod';

const MySchema = z.object({ id: z.string() });

export class MyClass {
	public execute(): void {}
}
`,
			expected: ['standard-conventions/no-schemas-in-class-files']
		},
		{
			name: 'Class file with Type definition (invalid)',
			path: 'ClassWithType.ts',
			content: `
type MyType = { id: string };

export class MyClass {
	public execute(): void {}
}
`,
			expected: ['standard-conventions/no-types-in-class-files']
		},
		{
			name: 'Class file with Interface definition (invalid)',
			path: 'ClassWithInterface.ts',
			content: `
interface MyInterface { id: string }

export class MyClass {
	public execute(): void {}
}
`,
			expected: ['standard-conventions/no-types-in-class-files']
		},
		{
			name: 'Class file with Constant (invalid)',
			path: 'ClassWithConstant.ts',
			content: `
const MAX_RETRIES = 5;

export class MyClass {
	public execute(): void {}
}
`,
			expected: ['standard-conventions/no-constants-in-class-files']
		},
		{
			name: 'Class file with only imports (valid)',
			path: 'ValidClass.ts',
			content: `
import { z } from 'zod';

export class ValidClass {
	public execute(): void {}
}
`,
			expected: []
		},
		{
			name: 'Schema file (valid)',
			path: 'MySchema.ts',
			content: `
import { z } from 'zod';
export const MySchema = z.object({ id: z.string() });
`,
			expected: [] // No class, so schemas allowed
		},
		{
			name: 'Type file (valid)',
			path: 'types/MyType.ts',
			content: `
export type MyType = { id: string };
`,
			expected: [] // No class, so types allowed
		},
		{
			name: 'Constant file (valid)',
			path: 'constants.ts',
			content: `
export const MAX_RETRIES = 5;
`,
			expected: [] // No class, so constants allowed
		}
	];

	console.log('🧪 Separation Rules Test (Strict Mode ENABLED)\n');

	for (const testFile of testFiles) {
		const filePath = path.join(testDir, testFile.path);
		const fileDir = path.dirname(filePath);

		if (!fs.existsSync(fileDir)) {
			fs.mkdirSync(fileDir, { recursive: true });
		}

		fs.writeFileSync(filePath, testFile.content);

		console.log(`📝 Testing: ${testFile.name}`);

		try {
			// Using STRICT config
			const output = execFileSync('npx', ['eslint', filePath, '--config', 'tests/strict-config.mjs', '--no-ignore'], {
				encoding: 'utf8',
				stdio: 'pipe',
				cwd: path.join(__dirname, '..')
			});

			console.log('   Found errors: none');

			if (testFile.expected.length > 0) {
				console.log(`   ❌ FAIL: Expected errors: ${testFile.expected.join(', ')}`);
				allPassed = false;
				failedCount++;
			}
			else {
				console.log('   ✅ PASS');
				passedCount++;
			}
		}
		catch (error) {
			const output = (error.stdout || '') + (error.stderr || '');
			const foundRules = testFile.expected.filter(rule => output.includes(rule));

			console.log(`   Found expected errors: ${foundRules.join(', ') || 'none'}`);

			if (foundRules.length === testFile.expected.length) {
				console.log('   ✅ PASS');
				passedCount++;
			}
			else {
				const missing = testFile.expected.filter(rule => !foundRules.includes(rule));
				console.log(`   ❌ FAIL: Missing errors: ${missing.join(', ')}`);
				console.log('   Actual output:', output);
				allPassed = false;
				failedCount++;
			}
		}
		console.log('');
	}

	console.log('🧪 Separation Rules Test (Strict Mode DISABLED)\n');

	// Verify that strict rules are NOT applied when strict mode is disabled
	const laxFiles = [
		{
			name: 'Class file with Schema (allowed in lax)',
			path: 'ClassWithSchema.ts',
			content: testFiles.find(t => t.name.includes('Class file with Schema')).content,
			expected: [] // Should have no errors
		},
		{
			name: 'Class file with Constant (allowed in lax)',
			path: 'ClassWithConstant.ts',
			content: testFiles.find(t => t.name.includes('Class file with Constant')).content,
			expected: [] // Should have no errors
		}
	];

	for (const testFile of laxFiles) {
		const filePath = path.join(testDir, testFile.path);
		// Assuming file already exists from previous run, but write it just in case
		fs.writeFileSync(filePath, testFile.content);

		console.log(`📝 Testing: ${testFile.name}`);

		try {
			// Using DEFAULT config (strict: false)
			const output = execFileSync('npx', ['eslint', filePath, '--config', 'tests/default-config.mjs', '--no-ignore'], {
				encoding: 'utf8',
				stdio: 'pipe',
				cwd: path.join(__dirname, '..')
			});

			console.log('   Found errors: none');

			if (testFile.expected.length > 0) {
				// We don't expect this branch for these tests
				console.log(`   ❌ FAIL: Expected errors: ${testFile.expected.join(', ')}`);
				allPassed = false;
				failedCount++;
			}
			else {
				console.log('   ✅ PASS');
				passedCount++;
			}
		}
		catch (error) {
			const output = (error.stdout || '') + (error.stderr || '');
			// If we expected no errors, any error is a failure
			// BUT we might get other errors (prettier, etc).
			// We specifically want to ensure NO standard-conventions/* errors

			const strictRules = [
				'standard-conventions/no-schemas-in-class-files',
				'standard-conventions/no-types-in-class-files',
				'standard-conventions/no-constants-in-class-files'
			];

			const foundStrictRules = strictRules.filter(rule => output.includes(rule));

			if (foundStrictRules.length > 0) {
				console.log(`   ❌ FAIL: Found strict errors when disabled: ${foundStrictRules.join(', ')}`);
				allPassed = false;
				failedCount++;
			} else {
				console.log('   ✅ PASS (ignoring unrelated errors)');
				passedCount++;
			}
		}
		console.log('');
	}

	cleanup();

	console.log(`\n📊 Results: ${passedCount} passed, ${failedCount} failed\n`);

	if (allPassed) {
		console.log('🎉 ALL TESTS PASSED!');
		process.exit(0);
	}
	else {
		console.log('❌ SOME TESTS FAILED.');
		process.exit(1);
	}
}

if (path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
	runTests().catch(error => {
		console.error('💥 Unexpected error:', error);
		cleanup();
		process.exit(1);
	});
}
