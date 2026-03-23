/**
 * Unicorn good practices test file
 * This file demonstrates modern JavaScript/TypeScript patterns that follow Unicorn rules
 */

/**
 * Better regex usage
 */
export function betterRegexUsage(): boolean {
	// Use optimized regex patterns
	const digitRegex = /\d/g;
	const wordRegex = /\w/g;
	const nonDigitRegex = /\D/g;
	
	return digitRegex.test('123') && wordRegex.test('abc') && nonDigitRegex.test('!@#');
}

/**
 * Proper catch error naming
 */
export function properCatchErrorNaming(): void {
	try {
		throw new Error('test');
	} catch (error) { // Properly named error parameter
		console.error('An error occurred:', error);
	}
}

/**
 * Consistent destructuring
 */
export function consistentDestructuring(): void {
	const obj = { name: 'John', age: 30, city: 'NYC' };
	
	// Use destructuring consistently
	const { name, age, city } = obj;
	console.log(name, age, city);
}

/**
 * Proper custom error definition
 */
export class ProperCustomError extends Error {
	public code: string;
	
	constructor(message: string, code: string) {
		super(message);
		this.name = 'ProperCustomError';
		this.code = code;
		
		// Maintain proper prototype chain
		Object.setPrototypeOf(this, ProperCustomError.prototype);
	}
}

/**
 * Error with proper message
 */
export function errorWithMessage(): void {
	throw new Error('Something went wrong');
}

/**
 * Explicit length check
 */
export function explicitLengthCheck(array: any[]): boolean {
	return array.length > 0;
}

/**
 * Use for-of instead of forEach
 */
export function useForOf(): void {
	const numbers = [1, 2, 3, 4, 5];
	
	// Use for-of loop instead of forEach
	for (const num of numbers) {
		console.log(num * 2);
	}
}

/**
 * Alternative to array reduce
 */
export function alternativeToReduce(): number {
	const numbers = [1, 2, 3, 4, 5];
	
	// Use a for-of loop instead of reduce for clarity
	let sum = 0;
	for (const num of numbers) {
		sum += num;
	}
	return sum;
}

/**
 * No console spaces
 */
export function noConsoleSpaces(): void {
	console.log('no leading or trailing spaces');
	console.log('clean console output');
}

/**
 * Use for-of instead of traditional for loop
 */
export function useForOfLoop(): void {
	const items = ['a', 'b', 'c'];
	
	// Use for-of loop
	for (const item of items) {
		console.log(item);
	}
}

/**
 * Use Array.isArray instead of instanceof
 */
export function useArrayIsArray(input: any): boolean {
	return Array.isArray(input);
}

/**
 * Use array literal instead of new Array
 */
export function useArrayLiteral(): any[] {
	return [1, 2, 3];
}

/**
 * Use Buffer.from instead of new Buffer
 */
export function useBufferFrom(): Buffer {
	return Buffer.from('hello', 'utf8');
}

/**
 * Use undefined instead of undefined
 */
export function useUndefined(): any {
	return undefined;
}

/**
 * Use namespace instead of static-only class
 */
export namespace UtilityFunctions {
	export function method1(): string {
		return 'method1';
	}
	
	export function method2(): string {
		return 'method2';
	}
}

/**
 * No unnecessary await
 */
export async function noUnnecessaryAwait(): Promise<string> {
	return Promise.resolve('value');
}

/**
 * Readable array destructuring
 */
export function readableArrayDestructuring(): void {
	const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	
	// Use readable destructuring with intermediate variables
	const seventh = array[6];
	console.log(seventh);
}

/**
 * No useless spread
 */
export function noUselessSpread(): number[] {
	return [1, 2, 3];
}

/**
 * Use Array.find properly
 */
export function useArrayFind(): any {
	const items = [1, 2, 3, 4, 5];
	
	return items.find(item => item > 3);
}

/**
 * Use Array.some properly
 */
export function useArraySome(): boolean {
	const items = [1, 2, 3, 4, 5];
	
	return items.some(item => item > 3);
}

/**
 * Use includes instead of indexOf
 */
export function useIncludes(): boolean {
	const items = ['a', 'b', 'c'];
	
	return items.includes('b');
}

/**
 * Use string startsWith and endsWith
 */
export function useStringStartsEndsWith(str: string): boolean {
	return str.startsWith('prefix') && str.endsWith('suffix');
}

/**
 * Use ternary operator
 */
export function useTernary(condition: boolean): string {
	return condition ? 'yes' : 'no';
}

/**
 * Throw error with new keyword
 */
export function throwNewError(): void {
	throw new Error('Something went wrong');
}