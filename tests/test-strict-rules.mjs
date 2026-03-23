import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testDir = path.join(__dirname, 'strict-rules-temp');

/**
 * Cleans up temporary test directory.
 */
function cleanup() {
	if (fs.existsSync(testDir)) {
		fs.rmSync(testDir, { recursive: true, force: true });
	}
}

/**
 * Runs comprehensive strict rules tests.
 */
async function runTests() {
	console.log('🧪 Comprehensive Strict Rules Regression Suite\n');

	cleanup();
	fs.mkdirSync(testDir);
	fs.mkdirSync(path.join(testDir, 'types'));
	fs.mkdirSync(path.join(testDir, 'services'));
	fs.mkdirSync(path.join(testDir, 'factories'));
	fs.mkdirSync(path.join(testDir, 'helpers'));
	fs.mkdirSync(path.join(testDir, 'schemas'));
	fs.mkdirSync(path.join(testDir, 'registries'));
	fs.mkdirSync(path.join(testDir, 'repositories'));

	const testFiles = [
		// 1. Factory Single Public Method
		{
			name: 'Factory - Valid: Single public method',
			path: 'factories/UserFactory.ts',
			content: `export class UserFactory {
				public create(): User { return new User(); }
				private helper(): void {}
			}`,
			expected: []
		},
		{
			name: 'Factory - Invalid: Multiple public methods',
			path: 'factories/BadFactory.ts',
			content: `export class BadFactory {
				public create(): User { return new User(); }
				public build(): User { return new User(); }
			}`,
			expected: ['standard-conventions/factory-single-public-method']
		},

		// 2. Service Single Public Method
		{
			name: 'Service - Valid: Single public method',
			path: 'services/UserService.ts',
			content: `export class UserService {
				public execute(): void {}
				private helper(): void {}
			}`,
			expected: []
		},
		{
			name: 'Service - Invalid: Multiple public methods',
			path: 'services/InvalidService.ts',
			content: `export class InvalidService {
				public execute(): void {}
				public doSomethingElse(): void {}
			}`,
			expected: ['standard-conventions/service-single-public-method']
		},

		// 3. Static Methods (Helpers vs Services)
		{
			name: 'No Static - Invalid: Static in Service',
			path: 'services/StaticService.ts',
			content: `export class StaticService {
				public static helper(): void {}
			}`,
			expected: ['standard-conventions/no-static-in-non-helpers']
		},
		{
			name: 'No Static - Valid: Static in Helper',
			path: 'helpers/DateHelper.ts',
			content: `export class DateHelper {
				public static format(): string { return ''; }
			}`,
			expected: []
		},
		{
			name: 'No Static - Valid: Static in Registry',
			path: 'registries/AdapterRegistry.ts',
			content: `export class AdapterRegistry {
				public static register(): void {}
			}`,
			expected: []
		},

		// 4. Interface Naming Rules
		{
			name: 'Interface - Valid: Starts with Type',
			path: 'types/TypeUser.ts',
			content: `export interface TypeUser { id: string; }`,
			expected: []
		},
		{
			name: 'Interface - Valid: Ends with Interface',
			path: 'types/UserInterface.ts',
			content: `export interface UserInterface { id: string; }`,
			expected: []
		},
		{
			name: 'Interface - Valid: MyServiceInterface',
			path: 'types/MyServiceInterface.ts',
			content: `export interface MyServiceInterface { method(): void; }`,
			expected: []
		},
		{
			name: 'Interface - Invalid: Plain name',
			path: 'types/User.ts',
			content: `export interface User { id: string; }`,
			expected: ['standard-conventions/interface-naming']
		},
		{
			name: 'Interface - Invalid: Starts with I',
			path: 'types/IUser.ts',
			content: `export interface IUser { id: string; }`,
			expected: ['standard-conventions/interface-naming']
		},
		{
			name: 'Interface - Invalid: Ends with Type',
			path: 'types/UserType.ts',
			content: `export interface UserType { id: string; }`,
			expected: ['standard-conventions/interface-naming']
		},
		{
			name: 'Interface - Invalid: Interface prefix',
			path: 'types/InterfaceUser.ts',
			content: `export interface InterfaceUser { id: string; }`,
			expected: ['standard-conventions/interface-naming']
		},

		// 5. Explicit Return Types
		{
			name: 'Explicit Return - Valid: Function Declaration',
			path: 'valid-func.ts',
			content: `export function add(a: number, b: number): number { return a + b; }`,
			expected: []
		},
		{
			name: 'Explicit Return - Valid: Arrow Function',
			path: 'valid-arrow.ts',
			content: `export const add = (a: number, b: number): number => a + b;`,
			expected: []
		},
		{
			name: 'Explicit Return - Valid: Class Method',
			path: 'services/ValidService.ts',
			content: `export class ValidService {
				public execute(): void {}
			}`,
			expected: []
		},
		{
			name: 'Explicit Return - Invalid: Missing on Function',
			path: 'invalid-func.ts',
			content: `export function add(a: number, b: number) { return a + b; }`,
			expected: ['standard-conventions/explicit-return-type']
		},
		{
			name: 'Explicit Return - Invalid: Missing on Arrow',
			path: 'invalid-arrow.ts',
			content: `export const add = (a: number, b: number) => a + b;`,
			expected: ['standard-conventions/explicit-return-type']
		},
		{
			name: 'Explicit Return - Ignored: Constructor',
			path: 'services/ConstructorService.ts',
			content: `export class ConstructorService {
				constructor() {}
				public execute(): void {}
			}`,
			expected: []
		},
		{
			name: 'Explicit Return - Ignored: Setter',
			path: 'services/SetterService.ts',
			content: `export class SetterService {
				private _val: string = '';
				set val(v: string) { this._val = v; }
				public execute(): void {}
			}`,
			expected: []
		},
		{
			name: 'Explicit Return - Checked: Getter',
			path: 'services/GetterService.ts',
			content: `export class GetterService {
				private _val: string = '';
				get val() { return this._val; }
				public execute(): void {}
			}`,
			expected: ['standard-conventions/explicit-return-type']
		},
		{
			name: 'Explicit Return - Checked: Async Function',
			path: 'async-func.ts',
			content: `export async function getData() { return Promise.resolve(1); }`,
			expected: ['standard-conventions/explicit-return-type']
		},

		// 6. No Direct Instantiation
		{
			name: 'Direct Instantiation - Valid: Built-ins',
			path: 'services/BuiltInService.ts',
			content: `export class BuiltInService {
				public execute(): void {
					const date = new Date();
					const err = new Error('oops');
					const map = new Map();
				}
			}`,
			expected: []
		},
		{
			name: 'Direct Instantiation - Valid: Outside Class',
			path: 'main.ts',
			content: `
			class MyService {}
			const service = new MyService(); // Allowed at top level / factory functions
			`,
			expected: []
		},
		{
			name: 'Direct Instantiation - Invalid: Inside Class',
			path: 'services/DependencyService.ts',
			content: `
			class OtherService {}
			export class DependencyService {
				private other: OtherService;
				constructor() {
					this.other = new OtherService();
				}
				public execute(): void {}
			}`,
			expected: ['standard-conventions/no-direct-instantiation']
		},
		{
			name: 'Direct Instantiation - Invalid: Inside Method',
			path: 'services/MethodService.ts',
			content: `
			class Helper {}
			export class MethodService {
				public execute(): void {
					const h = new Helper();
				}
			}`,
			expected: ['standard-conventions/no-direct-instantiation']
		},

		// 7. Prefer Enums
		{
			name: 'Prefer Enums - Valid: Enum',
			path: 'types/MyEnum.ts',
			content: `export enum MyEnum { A = 'a', B = 'b' }`,
			expected: []
		},
		{
			name: 'Prefer Enums - Valid: Single Literal',
			path: 'types/SingleLiteral.ts',
			content: `export type Single = 'a';`,
			expected: []
		},
		{
			name: 'Prefer Enums - Valid: Mixed Types',
			path: 'types/Mixed.ts',
			content: `export type Mixed = string | number;`,
			expected: []
		},
		{
			name: 'Prefer Enums - Invalid: String Union',
			path: 'types/StringUnion.ts',
			content: `export type StringUnion = 'a' | 'b' | 'c';`,
			expected: ['standard-conventions/prefer-enums']
		},
		{
			name: 'Prefer Enums - Invalid: Number Union',
			path: 'types/NumberUnion.ts',
			content: `export type NumberUnion = 1 | 2 | 3;`,
			expected: ['standard-conventions/prefer-enums']
		},

		// 8. Schema Naming
		{
			name: 'Schema Naming - Valid: Zod ends with Schema',
			path: 'schemas/UserSchema.ts',
			content: `// eslint-disable-next-line import-x/no-extraneous-dependencies
import { z } from 'zod';

export const UserSchema = z.object({ id: z.string() });`,
			expected: []
		},
		{
			name: 'Schema Naming - Valid: Drizzle ends with Table',
			path: 'schemas/UserTable.ts',
			content: `// eslint-disable-next-line import-x/no-extraneous-dependencies
import { pgTable } from 'drizzle-orm/pg-core';

export const UserTable = pgTable('users', {});`,
			expected: []
		},
		{
			name: 'Schema Naming - Invalid: Zod wrong name',
			path: 'schemas/UserZod.ts',
			content: `// eslint-disable-next-line import-x/no-extraneous-dependencies
import { z } from 'zod';

export const User = z.object({ id: z.string() });`,
			expected: ['standard-conventions/schema-naming']
		},
		{
			name: 'Schema Naming - Invalid: Drizzle wrong name',
			path: 'schemas/UserDb.ts',
			content: `// eslint-disable-next-line import-x/no-extraneous-dependencies
import { pgTable } from 'drizzle-orm/pg-core';

export const Users = pgTable('users', {});`,
			expected: ['standard-conventions/schema-naming']
		},

		// 9. No Utils Folder
		{
			name: 'No Utils - Valid: Helpers folder',
			path: 'helpers/StringHelper.ts',
			content: `export class StringHelper {}`,
			expected: []
		},
		{
			name: 'No Utils - Invalid: Utils folder',
			path: 'utils/StringUtil.ts',
			content: `export class StringUtil {}`,
			expected: ['standard-conventions/no-utils-folder']
		},
		{
			name: 'No Utils - Invalid: Util folder',
			path: 'util/DateUtil.ts',
			content: `export class DateUtil {}`,
			expected: ['standard-conventions/no-utils-folder']
		},

		// 10. Repository By ID
		{
			name: 'Repository - Valid: ById suffix methods',
			path: 'repositories/UserRepository.ts',
			content: `export class UserRepository {
				public findById(id: string): User | null { return null; }
				public deleteById(id: string): void {}
				public updateById(id: string, data: Record<string, unknown>): void {}
			}`,
			expected: []
		},
		{
			name: 'Repository - Valid: Mixed with ById',
			path: 'repositories/ProductRepository.ts',
			content: `export class ProductRepository {
				public findById(id: string): Product | null { return null; }
				public findAll(): Product[] { return []; }
				private helper(): void {}
			}`,
			expected: []
		},
		{
			name: 'Repository - Invalid: Missing ById suffix on find',
			path: 'repositories/OrderRepository.ts',
			content: `export class OrderRepository {
				public find(id: string): Order | null { return null; }
				public deleteById(id: string): void {}
			}`,
			expected: ['standard-conventions/repository-by-id']
		},
		{
			name: 'Repository - Invalid: Missing ById suffix on delete',
			path: 'repositories/CartRepository.ts',
			content: `export class CartRepository {
				public findById(id: string): Cart | null { return null; }
				public remove(id: string): void {}
			}`,
			expected: ['standard-conventions/repository-by-id']
		},
		{
			name: 'Repository - Invalid: Missing ById suffix on update',
			path: 'repositories/ItemRepository.ts',
			content: `export class ItemRepository {
				public findById(id: string): Item | null { return null; }
				public update(id: string, data: any): void {}
			}`,
			expected: ['standard-conventions/repository-by-id']
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
			// We use the strict comprehensive config
			// Note: We use relative path to config for clarity
			const configPath = path.resolve(__dirname, 'strict-rules-config.mjs');

			const output = execFileSync('npx', ['eslint', filePath, '--config', configPath, '--no-ignore'], {
				encoding: 'utf8',
				stdio: 'pipe',
				cwd: path.join(__dirname, '..')
			});

			// If we expected no errors
			if (testFile.expected.length === 0) {
				console.log('   Found errors: none');
				console.log('   ✅ PASS');
				passedCount++;
			} else {
				// We expected errors but got none
				console.log('   Found errors: none');
				console.log(`   ❌ FAIL: Expected errors: ${testFile.expected.join(', ')}`);
				allPassed = false;
				failedCount++;
			}
		} catch (error) {
			const output = (error.stdout || '') + (error.stderr || '');
			const foundRules = testFile.expected.filter(rule => output.includes(rule));
			const unexpectedErrors = output.split('\n').filter(line => line.includes('error') && !testFile.expected.some(exp => line.includes(exp)));

			if (testFile.expected.length === 0) {
				// We expected success but got failure
				console.log('   ❌ FAIL: Unexpected errors found');
				console.log(output);
				allPassed = false;
				failedCount++;
			} else {
				// We expected specific errors
				if (foundRules.length > 0) {
					console.log(`   Found expected errors: ${foundRules.join(', ')}`);
				} else {
					console.log(`   Found NO expected errors from: ${testFile.expected.join(', ')}`);
				}

				if (foundRules.length === testFile.expected.length) {
					console.log('   ✅ PASS');
					passedCount++;
				} else {
					const missing = testFile.expected.filter(rule => !foundRules.includes(rule));
					console.log(`   ❌ FAIL: Missing errors: ${missing.join(', ')}`);
					if (unexpectedErrors.length > 0) {
						console.log('   ⚠️ Unexpected errors also found:');
						console.log(output);
					}
					allPassed = false;
					failedCount++;
				}
			}
		}
		console.log('');
	}

	cleanup();

	console.log(`\n📊 Results: ${passedCount} passed, ${failedCount} failed\n`);

	if (allPassed) {
		console.log('🎉 ALL COMPREHENSIVE STRICT TESTS PASSED!');
		process.exit(0);
	} else {
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
