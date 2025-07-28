// This file contains code that follows all safety rules

import { readFile, writeFile } from 'fs'; // Single import statement

/**
 * Properly handled promise
 * @returns {Promise<void>}
 */
export async function properPromiseHandling(): Promise<void> {
	await fetch('/api/data');
	// or
	fetch('/api/background').catch(console.error);
}

/**
 * Await only promises
 * @returns {Promise<number>}
 */
export async function awaitOnlyPromises(): Promise<number> {
	const value = await Promise.resolve(42);
	return value;
}

/**
 * Async function with await
 * @returns {Promise<string>}
 */
export async function asyncWithAwait(): Promise<string> {
	const data = await fetch('/api/data');
	return data.text();
}

/**
 * Proper array manipulation
 * @returns {void}
 */
export function properArrayManipulation(): void {
	const arr = [1, 2, 3];
	arr.splice(1, 1); // Remove element properly
}

/**
 * Array callback with return
 * @returns {number[]}
 */
export function arrayCallbackWithReturn(): number[] {
	const numbers = [1, 2, 3];
	return numbers.map((n) => n * 2);
}

/**
 * Throwing proper errors
 * @returns {void}
 */
export function throwProperError(): void {
	throw new Error('This is a proper error');
}

/**
 * Proper error handling
 * @returns {void}
 */
export function properErrorHandling(): void {
	try {
		throw new Error('test');
	} catch (e) {
		console.error('Error caught:', e);
	}
}

/**
 * Switch with proper breaks
 * @param {number} value - The value to switch on
 * @returns {string} The result
 */
export function switchWithBreaks(value: number): string {
	switch (value) {
		case 1:
			console.warn('one');
			return 'one';
		case 2:
			return 'two';
		default:
			return 'other';
	}
}

/**
 * Safe optional chaining
 * @param {object | null} obj - The object to check
 * @returns {void}
 */
export function safeOptionalChaining(obj: { prop?: { method?: () => void } } | null): void {
	if (obj?.prop?.method) {
		obj.prop.method();
	}
}

/**
 * No variable shadowing
 * @param {number} value - The input value
 * @returns {void}
 */
export function noVariableShadowing(value: number): void {
	const outerResult = value * 2;
	if (value > 0) {
		const innerResult = value * 3;
		console.warn(innerResult, outerResult);
	}
}

/**
 * Define before use
 * @returns {void}
 */
export function defineBeforeUse(): void {
	const properlyDefined = 42;
	console.warn(properlyDefined);
}

/**
 * Parallel async operations
 * @param {string[]} urls - The URLs to fetch
 * @returns {Promise<Response[]>}
 */
export async function parallelAsync(urls: string[]): Promise<Response[]> {
	// Good: parallel execution
	return Promise.all(urls.map(url => fetch(url)));
}

/**
 * No eval or similar
 * @param {() => void} callback - The callback to execute
 * @returns {void}
 */
export function noEval(callback: () => void): void {
	callback(); // Direct function call
}

/**
 * Proper setTimeout usage
 * @returns {void}
 */
export function properSetTimeout(): void {
	setTimeout(() => {
		console.warn('hello');
	}, 1000);
}

/**
 * Proper function creation
 * @param {number} x - First parameter
 * @param {number} y - Second parameter
 * @returns {number} The sum
 */
export function properFunction(x: number, y: number): number {
	return x + y;
}

/**
 * Always use curly braces
 * @param {number} value - The value to check
 * @returns {void}
 */
export function alwaysCurlyBraces(value: number): void {
	if (value > 0) {
		console.warn('positive');
	}
}

/**
 * Strict equality
 * @param {unknown} a - First value
 * @param {unknown} b - Second value
 * @returns {boolean} Whether equal
 */
export function strictEquality(a: unknown, b: unknown): boolean {
	return a === b;
}

/**
 * Using const and let
 * @returns {void}
 */
export function usingConstAndLet(): void {
	const unchangedValue = 42;
	let changingValue = 0;
	changingValue += unchangedValue;
	console.warn(changingValue);
}

/**
 * Using console.warn instead of log
 * @returns {void}
 */
export function usingConsoleWarn(): void {
	console.warn('This is allowed');
	console.error('This is also allowed');
}

/**
 * Expressions with side effects
 * @returns {void}
 */
export function expressionsWithSideEffects(): void {
	// Using short-circuit evaluation (allowed with our config)
	const condition = true;
	condition && console.warn('This is allowed');
	
	// Ternary with side effects (allowed with our config)
	condition ? console.warn('true') : console.error('false');
}

/**
 * No assignment in conditions
 * @param {number} value - The input value
 * @returns {void}
 */
export function noAssignmentInCondition(value: number): void {
	const result = value * 2;
	if (result > 0) {
		console.warn(result);
	}
}

/**
 * Dynamic conditions
 * @param {number} value - The value to check
 * @returns {void}
 */
export function dynamicConditions(value: number): void {
	if (value > 0) {
		console.warn('positive');
	}
	
	let i = 0;
	while (i < value) {
		console.warn(i);
		i++;
	}
}

/**
 * No debugger in production
 * @returns {void}
 */
export function noDebugger(): void {
	// Production ready code
	console.warn('Clean code');
}

/**
 * Unique object keys
 * @type {object}
 */
export const uniqueKeys = {
	name: 'John',
	age: 30,
	city: 'New York'
};

/**
 * Safe number handling
 * @returns {void}
 */
export function safeNumbers(): void {
	const safeNumber = 9007199254740991; // MAX_SAFE_INTEGER
	console.warn(safeNumber);
}

/**
 * Proper zero comparison
 * @param {number} value - The value to check
 * @returns {boolean} Whether negative zero
 */
export function properZeroComparison(value: number): boolean {
	return Object.is(value, -0);
}

/**
 * Proper NaN check
 * @param {number} value - The value to check
 * @returns {boolean} Whether NaN
 */
export function properNaNCheck(value: number): boolean {
	return isNaN(value);
}

/**
 * Reachable code only
 * @returns {string} The result
 */
export function reachableCode(): string {
	console.warn('This runs');
	return 'done';
}

/**
 * Correct loop direction
 * @returns {void}
 */
export function correctLoopDirection(): void {
	for (let i = 0; i < 10; i++) {
		console.warn(i);
	}
}

/**
 * Modified loop condition
 * @returns {void}
 */
export function modifiedLoopCondition(): void {
	let x = 0;
	while (x < 10) {
		console.warn(x);
		x++; // Condition is modified
	}
}