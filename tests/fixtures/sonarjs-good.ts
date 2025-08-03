/**
 * SonarJS good practices test file
 * This file demonstrates clean code practices that avoid SonarJS violations
 */

/**
 * Low cognitive complexity function
 */
export function lowCognitiveComplexity(value: number): string {
	// Simple, linear logic with low cognitive complexity
	if (value < 0) {
		return 'negative';
	}
	
	if (value === 0) {
		return 'zero';
	}
	
	return value > 100 ? 'large' : 'small';
}

/**
 * No identical expressions
 */
export function properComparison(a: number, b: number, threshold: number): boolean {
	// Different meaningful expressions
	return a + b > threshold && a * b < threshold;
}

/**
 * Unique functions with different logic
 */
export function formatUpperCase(text: string): string {
	return text.toUpperCase().trim();
}

export function formatLowerCase(text: string): string {
	return text.toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Avoid duplicate strings by using constants
 */
export class StringConstants {
	private static SUCCESS_MESSAGE = 'Operation completed successfully';
	private static ERROR_MESSAGE = 'An error occurred during processing';
	
	public success(): string {
		return StringConstants.SUCCESS_MESSAGE;
	}
	
	public error(): string {
		return StringConstants.ERROR_MESSAGE;
	}
	
	public log(): void {
		console.log(StringConstants.SUCCESS_MESSAGE);
	}
}

/**
 * Immediate return pattern
 */
export function immediateReturn(value: string): string {
	return value.toLowerCase().trim();
}

/**
 * Object literal usage
 */
export function createObject(): Record<string, string> {
	return {
		key1: 'value1',
		key2: 'value2',
		key3: 'value3'
	};
}

/**
 * Direct boolean return
 */
export function isPositive(x: number): boolean {
	return x > 0;
}

/**
 * No redundant boolean operations
 */
export function checkCondition(condition: boolean): boolean {
	return condition;
}

/**
 * Used collections
 */
export function useCollections(): string[] {
	const usedArray = [1, 2, 3, 4, 5];
	const usedSet = new Set(['a', 'b', 'c']);
	
	// Collections are actually used
	const doubled = usedArray.map(n => n * 2);
	const combined = [...doubled, ...Array.from(usedSet)];
	
	return combined.map(String);
}

/**
 * Meaningful catch block
 */
export function meaningfulCatch(): string {
	try {
		return JSON.parse('invalid json');
	} catch (error) {
		// Meaningful error handling
		console.error('JSON parsing failed:', error);
		return 'default value';
	}
}

/**
 * Proper while loop usage
 */
export function properWhileLoop(): number {
	let count = 0;
	
	while (count < 10) {
		count++;
	}
	
	return count;
}

/**
 * Reasonable switch case count
 */
export function reasonableSwitchCases(value: number): string {
	switch (value) {
		case 1:
			return 'one';
		case 2:
			return 'two';
		case 3:
			return 'three';
		case 4:
			return 'four';
		case 5:
			return 'five';
		default:
			return 'other';
	}
}

/**
 * Avoid nested switch statements
 */
export function avoidNestedSwitch(x: number, y: number): string {
	// Use separate functions or if-else instead of nested switch
	const xResult = handleXValue(x);
	const yResult = handleYValue(y);
	
	return `${xResult}-${yResult}`;
}

function handleXValue(x: number): string {
	switch (x) {
		case 1: return 'one';
		case 2: return 'two';
		default: return 'other';
	}
}

function handleYValue(y: number): string {
	switch (y) {
		case 1: return 'alpha';
		case 2: return 'beta';
		default: return 'gamma';
	}
}

/**
 * Simple template literals
 */
export function simpleTemplateLiterals(name: string, age: number): string {
	const ageInfo = `age: ${age}`;
	const nameInfo = `${name} (${ageInfo})`;
	
	return `Hello ${nameInfo}`;
}

/**
 * No redundant returns
 */
export function noRedundantJump(condition: boolean): void {
	if (condition) {
		console.log('condition is true');
	} else {
		console.log('condition is false');
	}
	// No redundant return statement
}

/**
 * Multi-line conditionals
 */
export function multiLineConditional(x: number): void {
	if (x > 0) {
		console.log('positive');
	} else {
		console.log('non-positive');
	}
}