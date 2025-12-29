import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testDir = path.join(__dirname, 'strict-test-temp');
const badFolderDir = path.join(testDir, 'bad-folder-name');
const servicesDir = path.join(testDir, 'services');
const helpersDir = path.join(testDir, 'helpers');
const typesDir = path.join(testDir, 'types');
const transformersDir = path.join(testDir, 'transformers');
const repositoriesDir = path.join(testDir, 'repositories');

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
 * Runs all strict conventions tests.
 * @returns {Promise<void>} Resolves when tests complete.
 */
async function runTests() {
	console.log('🧪 Strict Conventions Test\n');

	cleanup();
	fs.mkdirSync(testDir);
	fs.mkdirSync(badFolderDir);
	fs.mkdirSync(servicesDir);
	fs.mkdirSync(helpersDir);
	fs.mkdirSync(typesDir);
	fs.mkdirSync(transformersDir);
	fs.mkdirSync(repositoriesDir);

	const testFiles = [
		{
			name: 'Interface vs Type (Interface suffix)',
			path: 'types-test.ts',
			content: `interface UserInterface { id: string }
`,
			expected: [] // Valid - ends with Interface
		},
		{
			name: 'Interface vs Type (Type prefix)',
			path: 'types/TypeUser.ts',
			content: `interface TypeUser { id: string }
`,
			expected: [] // Valid - starts with Type and in types folder
		},
		{
			name: 'Interface invalid naming',
			path: 'invalid-interface.ts',
			content: `interface UserData { id: string }
`,
			expected: ['@typescript-eslint/naming-convention'] // Invalid - neither Type prefix nor Interface suffix
		},
		{
			name: 'Service naming and public methods (valid)',
			path: 'services/UserService.ts',
			content: `export class UserService {
	public execute(): void {}
}
`,
			expected: [] // Valid - one public method
		},
		{
			name: 'Service with multiple public methods (invalid)',
			path: 'services/MyService.ts',
			content: `export class MyService {
	public first(): void {}
	public second(): void {}
}
`,
			expected: ['standard-conventions/service-single-public-method']
		},
		{
			name: 'Function name matching filename',
			path: 'wrongName.ts',
			content: `export function correctName(): void {}
`,
			expected: ['standard-conventions/function-name-match-filename']
		},
		{
			name: 'Folder camelCase',
			path: 'bad-folder-name/test.ts',
			content: `export const a = 1;
`,
			expected: ['standard-conventions/folder-camel-case']
		},
		{
			name: 'Helper with static methods only (valid)',
			path: 'helpers/ValidationHelper.ts',
			content: `export class ValidationHelper {
	public static validate(value: string): boolean {
		return value.length > 0;
	}
}
`,
			expected: [] // Valid - only static methods
		},
		{
			name: 'Helper with non-static method (invalid)',
			path: 'helpers/BadHelper.ts',
			content: `export class BadHelper {
	public validate(value: string): boolean {
		return value.length > 0;
	}
}
`,
			expected: ['standard-conventions/helper-static-only']
		},
		{
			name: 'Non-helper with static method (invalid)',
			path: 'services/StaticService.ts',
			content: `export class StaticService {
	public static getInstance(): StaticService {
		return new StaticService();
	}
	public execute(): void {}
}
`,
			expected: ['standard-conventions/no-static-in-non-helpers']
		},
		{
			name: 'Type in wrong location (invalid)',
			path: 'TypeWrongLocation.ts',
			content: `interface TypeUser { id: string }
`,
			expected: ['standard-conventions/type-location']
		},
		{
			name: 'Type in correct location (valid)',
			path: 'types/TypeUser.ts',
			content: `interface TypeUser { id: string }
`,
			expected: []
		},
		{
			name: 'Service in wrong folder (invalid)',
			path: 'WrongLocationService.ts',
			content: `export class WrongLocationService {
	public execute(): void {}
}
`,
			expected: ['standard-conventions/class-location']
		},
		{
			name: 'Transformer with multiple methods (invalid)',
			path: 'transformers/BadTransformer.ts',
			content: `export class BadTransformer {
	public transform(): void {}
	public parse(): void {}
}
`,
			expected: ['standard-conventions/transformer-single-public-method']
		},
		{
			name: 'Transformer with single method (valid)',
			path: 'transformers/GoodTransformer.ts',
			content: `export class GoodTransformer {
	public transform(): void {}
}
`,
			expected: []
		},
		{
			name: 'Multiple classes per file (invalid)',
			path: 'services/MultiClass.ts',
			content: `export class FirstService {
	public execute(): void {}
}
export class SecondService {
	public run(): void {}
}
`,
			expected: ['standard-conventions/one-class-per-file']
		},
		{
			name: 'CommandRepository with query method (invalid)',
			path: 'repositories/UserCommandRepository.ts',
			content: `export class UserCommandRepository {
	public getUser(): void {}
}
`,
			expected: ['standard-conventions/repository-cqrs']
		},
		{
			name: 'QueryRepository with command method (invalid)',
			path: 'repositories/UserQueryRepository.ts',
			content: `export class UserQueryRepository {
	public createUser(): void {}
}
`,
			expected: ['standard-conventions/repository-cqrs']
		},
		{
			name: 'CommandRepository with valid methods',
			path: 'repositories/ValidCommandRepository.ts',
			content: `export class ValidCommandRepository {
	public create(): void {}
	public update(): void {}
	public delete(): void {}
}
`,
			expected: [] // Valid - only command methods
		},
		{
			name: 'QueryRepository with valid methods',
			path: 'repositories/ValidQueryRepository.ts',
			content: `export class ValidQueryRepository {
	public find(): void {}
	public getById(): void {}
	public list(): void {}
}
`,
			expected: [] // Valid - only query methods
		}
	];

	let allPassed = true;
	let passedCount = 0;
	let failedCount = 0;

	for (const testFile of testFiles) {
		const filePath = path.join(testDir, testFile.path);

		// Create directories if needed
		const fileDir = path.dirname(filePath);

		if (!fs.existsSync(fileDir)) {
			fs.mkdirSync(fileDir, { recursive: true });
		}

		fs.writeFileSync(filePath, testFile.content);

		console.log(`📝 Testing: ${testFile.name}`);

		try {
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

			// console.log('DEBUG OUTPUT:', output);
			const foundRules = testFile.expected.filter(rule => output.includes(rule));

			console.log(`   Found expected errors: ${foundRules.join(', ') || 'none'}`);

			if (foundRules.length === testFile.expected.length) {
				console.log('   ✅ PASS');
				passedCount++;
			}
			else {
				const missing = testFile.expected.filter(rule => !foundRules.includes(rule));

				console.log(`   ❌ FAIL: Missing errors: ${missing.join(', ')}`);
				allPassed = false;
				failedCount++;
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

export { runTests };
