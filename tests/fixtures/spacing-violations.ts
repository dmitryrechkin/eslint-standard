/**
 * Test fixture for code spacing/density rule violations
 * This file contains dense code that should trigger padding-line-between-statements
 */

// 1. Missing blank line after imports
import { readFileSync } from 'fs';
const immediateAfterImport = 'should have blank line above';

// 2. Missing blank line after variable declarations before different statement
const firstVar = 1;
const secondVar = 2;
const thirdVar = 3;
console.log(firstVar, secondVar, thirdVar); // Should have blank line above

// 3. Missing blank line before return
function noBlankBeforeReturn(): string {
	const result = 'value';
	return result; // Should have blank line above
}

// 4. Missing blank line before/after if statement
function denseIfStatement(): void {
	const x = 1;
	if (x > 0) {
		console.log('positive');
	}
	const y = 2;
	console.log(y);
}

// 5. Missing blank line before/after switch
function denseSwitchStatement(value: number): string {
	const prefix = 'result: ';
	switch (value) {
		case 1:
			return prefix + 'one';
		case 2:
			return prefix + 'two';
		default:
			return prefix + 'unknown';
	}
	const suffix = '!'; // Unreachable but tests the rule
	return suffix;
}

// 6. Missing blank line before/after try-catch
function denseTryCatch(): void {
	const data = 'test';
	try {
		console.log(data);
	} catch (error) {
		console.error(error);
	}
	const cleanup = true;
	console.log(cleanup);
}

// 7. Missing blank line before/after while loop
function denseWhileLoop(): void {
	const items = [1, 2, 3];
	let i = 0;
	while (i < items.length) {
		console.log(items[i]);
		i++;
	}
	const done = true;
	console.log(done);
}

// 8. Missing blank line before/after for loop
function denseForLoop(): void {
	const items = [1, 2, 3];
	for (const item of items) {
		console.log(item);
	}
	const complete = true;
	console.log(complete);
}

// 9. Missing blank line before/after function declarations
function firstFunction(): void {
	console.log('first');
}
function secondFunction(): void {
	console.log('second');
}
function thirdFunction(): void {
	console.log('third');
}

// 10. Dense class members
class DenseClass {
	private value = 1;
	private name = 'test';
	constructor() {
		this.value = 2;
	}
	getValue(): number {
		return this.value;
	}
	getName(): string {
		return this.name;
	}
	setValue(v: number): void {
		this.value = v;
	}
}

// Export to use functions
export {
	noBlankBeforeReturn,
	denseIfStatement,
	denseSwitchStatement,
	denseTryCatch,
	denseWhileLoop,
	denseForLoop,
	firstFunction,
	secondFunction,
	thirdFunction,
	DenseClass
};
