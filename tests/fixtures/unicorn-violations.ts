/**
 * Unicorn violations test file
 * This file contains JavaScript/TypeScript patterns that Unicorn rules should catch
 */

/**
 * Test better regex violations
 */
export function testBetterRegex(): boolean {
	// unicorn/better-regex - Can be optimized
	const regex1 = /[0-9]/g; // Should use \d
	const regex2 = /[a-zA-Z]/g; // Should use \w
	const regex3 = /[^0-9]/g; // Should use \D
	
	return regex1.test('123') && regex2.test('abc') && regex3.test('!@#');
}

/**
 * Test catch error name violations
 */
export function testCatchErrorName(): void {
	try {
		throw new Error('test');
	} catch (e) { // unicorn/catch-error-name - should be named 'error'
		console.log(e);
	}
}

/**
 * Test consistent destructuring violations
 */
export function testConsistentDestructuring(): void {
	const obj = { name: 'John', age: 30, city: 'NYC' };
	
	// unicorn/consistent-destructuring - should destructure
	console.log(obj.name);
	console.log(obj.age);
	console.log(obj.city);
}

/**
 * Test custom error definition violations
 */
export class BadCustomError extends Error {
	// unicorn/custom-error-definition - missing proper constructor
	public code: string;
}

/**
 * Test error message violations
 */
export function testErrorMessage(): void {
	// unicorn/error-message - Error should have a message
	throw new Error();
}

/**
 * Test explicit length check violations
 */
export function testExplicitLengthCheck(array: any[]): boolean {
	// unicorn/explicit-length-check
	return array.length; // Should use explicit comparison
}

/**
 * Test array forEach violations
 */
export function testArrayForEach(): void {
	const numbers = [1, 2, 3, 4, 5];
	
	// unicorn/no-array-for-each - should use for-of loop
	numbers.forEach((num) => {
		console.log(num * 2);
	});
}

/**
 * Test array reduce violations
 */
export function testArrayReduce(): number {
	const numbers = [1, 2, 3, 4, 5];
	
	// unicorn/no-array-reduce - reduce can be hard to understand
	return numbers.reduce((sum, num) => sum + num, 0);
}

/**
 * Test console spaces violations
 */
export function testConsoleSpaces(): void {
	// unicorn/no-console-spaces
	console.log(' leading space');
	console.log('trailing space ');
}

/**
 * Test for loop violations
 */
export function testForLoop(): void {
	const items = ['a', 'b', 'c'];
	
	// unicorn/no-for-loop - should use for-of
	for (let i = 0; i < items.length; i++) {
		console.log(items[i]);
	}
}

/**
 * Test instanceof Array violations
 */
export function testInstanceofArray(input: any): boolean {
	// unicorn/no-instanceof-array - should use Array.isArray
	return input instanceof Array;
}

/**
 * Test new Array violations
 */
export function testNewArray(): any[] {
	// unicorn/no-new-array - should use array literal
	return new Array(1, 2, 3);
}

/**
 * Test new Buffer violations
 */
export function testNewBuffer(): Buffer {
	// unicorn/no-new-buffer - should use Buffer.from
	return new Buffer('hello', 'utf8');
}

/**
 * Test null usage violations  
 */
export function testNullUsage(): any {
	// unicorn/no-null - should use undefined instead of null
	return null;
}

/**
 * Test static only class violations
 */
export class StaticOnlyClass {
	// unicorn/no-static-only-class - should use namespace or functions
	public static method1(): string {
		return 'method1';
	}
	
	public static method2(): string {
		return 'method2';
	}
}

/**
 * Test unnecessary await violations
 */
export async function testUnnecessaryAwait(): Promise<string> {
	// unicorn/no-unnecessary-await
	return await Promise.resolve('value');
}

/**
 * Test unreadable array destructuring violations
 */
export function testUnreadableArrayDestructuring(): void {
	const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	
	// unicorn/no-unreadable-array-destructuring
	const [,,,,,, seventh] = array;
	console.log(seventh);
}

/**
 * Test useless spread violations
 */
export function testUselessSpread(): number[] {
	// unicorn/no-useless-spread
	return [...[1, 2, 3]];
}

/**
 * Test prefer array find violations
 */
export function testPreferArrayFind(): any {
	const items = [1, 2, 3, 4, 5];
	
	// unicorn/prefer-array-find - should use find instead
	return items.filter(item => item > 3)[0];
}

/**
 * Test prefer array some violations
 */
export function testPreferArraySome(): boolean {
	const items = [1, 2, 3, 4, 5];
	
	// unicorn/prefer-array-some - should use some instead
	return items.filter(item => item > 3).length > 0;
}

/**
 * Test prefer includes violations
 */
export function testPreferIncludes(): boolean {
	const items = ['a', 'b', 'c'];
	
	// unicorn/prefer-includes - should use includes instead
	return items.indexOf('b') !== -1;
}

/**
 * Test prefer string starts/ends with violations
 */
export function testPreferStringStartsEndsWith(str: string): boolean {
	// unicorn/prefer-string-starts-ends-with
	return str.indexOf('prefix') === 0 && str.lastIndexOf('suffix') === str.length - 6;
}

/**
 * Test prefer ternary violations
 */
export function testPreferTernary(condition: boolean): string {
	// unicorn/prefer-ternary - should use ternary
	if (condition) {
		return 'yes';
	} else {
		return 'no';
	}
}

/**
 * Test throw new error violations
 */
export function testThrowNewError(): void {
	// unicorn/throw-new-error - should use new
	throw Error('Something went wrong');
}