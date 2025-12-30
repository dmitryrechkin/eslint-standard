// This file contains code that violates safety rules for testing

// 1. Floating promises
export async function floatingPromise(): Promise<void> {
	fetch('/api/data'); // Floating promise - not awaited or handled
	Promise.resolve('test'); // Another floating promise
}

// 2. Await non-promise
export async function awaitNonPromise(): Promise<void> {
	const value = 42;
	await value; // Awaiting non-promise
}

// 3. Async function without await
export async function asyncWithoutAwait(): Promise<string> {
	// Missing await
	return 'no await here';
}

// 4. Array delete
export function arrayDelete(): void {
	const arr = [1, 2, 3];
	delete arr[1]; // Should use splice
}

// 5. Array callback without return
export function arrayCallbackNoReturn(): void {
	const numbers = [1, 2, 3];
	numbers.map((n) => {
		console.log(n); // Missing return
	});
}

// 6. Throwing non-error
export function throwNonError(): void {
	throw 'This is a string'; // Should throw Error object
}

// 7. Empty catch block
export function emptyCatch(): void {
	try {
		throw new Error('test');
	} catch (e) {
	}
}

// 8. Switch fallthrough
export function switchFallthrough(value: number): string {
	let result = '';
	switch (value) {
		case 1:
			result = 'one';
			// Missing break - fallthrough
		case 2:
			result = 'two';
			break;
		default:
			result = 'other';
	}
	return result;
}

// 9. Optional chaining misuse
export function unsafeOptionalChaining(obj: any): void {
	const value = obj?.prop?.method?.(); // Unsafe usage
	console.log(value);
}

// 10. Variable shadowing
export function variableShadowing(value: number): void {
	const result = value * 2;
	if (value > 0) {
		const result = value * 3; // Shadowing outer result
		console.log(result);
	}
}

// 11. Use before define
export function useBeforeDefine(): void {
	console.log(laterDefined); // Used before defined
	const laterDefined = 42;
}

// 12. Await in loop
export async function awaitInLoop(urls: string[]): Promise<void> {
	for (const url of urls) {
		await fetch(url); // Await in loop - performance issue
	}
}

// 13. Using eval
export function usingEval(code: string): any {
	return eval(code); // Security issue
}

// 14. Implied eval
export function impliedEval(): void {
	setTimeout('console.log("hello")', 1000); // String passed to setTimeout
}

// 15. new Function
export function newFunction(code: string): any {
	return new Function(code); // Security issue
}

// 16. No curly braces
export function noCurlyBraces(value: number): void {
	if (value > 0)
		console.log('positive'); // Missing curly braces
}

// 17. Using == instead of ===
export function looseEquality(a: any, b: any): boolean {
	return a == b; // Should use ===
}

// 18. Using var
export function usingVar(): void {
	var oldStyle = 'bad'; // Should use let/const
	console.log(oldStyle);
}

// 19. Not using const
export function notUsingConst(): void {
	let unchangedValue = 42; // Should be const
	console.log(unchangedValue);
}

// 20. Console.log
export function usingConsoleLog(): void {
	console.log('This should warn'); // Only warn/error allowed
}

// 21. Side-effect free expression
export function sideEffectFree(): void {
	5 + 3; // No side effect
	'hello'; // No side effect
}

// 22. Assignment in condition
export function assignmentInCondition(value: number): void {
	let result: number;
	if (result = value * 2) { // Assignment in condition
		console.log(result);
	}
}

// 23. Constant condition
export function constantCondition(): void {
	if (true) { // Constant condition
		console.log('always runs');
	}
	
	while (false) { // Constant condition
		console.log('never runs');
	}
}

// 24. Debugger statement
export function debuggerStatement(): void {
	debugger; // Should not be in code
}

// 25. Duplicate object keys
export const duplicateKeys = {
	name: 'John',
	age: 30,
	name: 'Jane' // Duplicate key
};

// 26. Loss of precision
export function lossOfPrecision(): void {
	const bigNumber = 9007199254740993; // Loss of precision
	console.log(bigNumber);
}

// 27. Compare with -0
export function compareNegZero(value: number): boolean {
	return value === -0; // Should use Object.is
}

// 28. NaN comparison
export function nanComparison(value: number): boolean {
	return value === NaN; // Should use isNaN
}

// 29. Return await (now allowed, but was an issue)
export async function returnAwait(): Promise<string> {
	return await Promise.resolve('test'); // Actually useful for stack traces
}

// 30. Duplicate imports
import { readFile } from 'node:fs';
import { writeFile } from 'node:fs'; // Should be single import

// 31. Unreachable code
export function unreachableCode(): string {
	return 'done';
	console.log('never reached'); // Unreachable
}

// 32. For loop wrong direction
export function wrongLoopDirection(): void {
	for (let i = 0; i < 10; i--) { // Wrong direction - infinite loop
		console.log(i);
	}
}

// 33. Unmodified loop condition
export function unmodifiedLoopCondition(): void {
	let x = 0;
	while (x < 10) {
		console.log('infinite'); // x never modified
	}
}