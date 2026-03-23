/**
 * SonarJS violations test file
 * This file contains code smells and maintainability issues to test SonarJS rules
 */

/**
 * Test cognitive complexity violation
 */
export function highCognitiveComplexity(x: number, y: number, z: number): string {
	// sonarjs/cognitive-complexity - This function has high cognitive complexity
	if (x > 0) {
		if (y > 0) {
			if (z > 0) {
				for (let i = 0; i < x; i++) {
					if (i % 2 === 0) {
						for (let j = 0; j < y; j++) {
							if (j % 3 === 0) {
								while (z > 0) {
									if (z % 5 === 0) {
										return 'complex';
									}
									z--;
								}
							}
						}
					}
				}
			} else {
				return 'negative z';
			}
		} else {
			return 'negative y';
		}
	} else {
		return 'negative x';
	}
	return 'default';
}

/**
 * Test identical expressions
 */
export function identicalExpressions(a: number, b: number): boolean {
	// sonarjs/no-identical-expressions
	return a + b === a + b; // Identical expressions on both sides
}

/**
 * Test identical functions
 */
export function identicalFunction1(x: string): string {
	// sonarjs/no-identical-functions
	return x.toUpperCase().trim();
}

export function identicalFunction2(y: string): string {
	// Identical to identicalFunction1
	return y.toUpperCase().trim();
}

/**
 * Test duplicate strings
 */
export class DuplicateStrings {
	// sonarjs/no-duplicate-string
	public method1(): string {
		return 'This is a duplicate string that appears multiple times';
	}

	public method2(): string {
		return 'This is a duplicate string that appears multiple times';
	}

	public method3(): string {
		return 'This is a duplicate string that appears multiple times';
	}

	public method4(): string {
		return 'This is a duplicate string that appears multiple times';
	}
}

/**
 * Test prefer immediate return
 */
export function preferImmediateReturn(value: string): string {
	// sonarjs/prefer-immediate-return
	const result = value.toLowerCase();
	return result; // Should immediately return the expression
}

/**
 * Test prefer object literal
 */
export function preferObjectLiteral(): Record<string, any> {
	// sonarjs/prefer-object-literal
	const obj = new Object();
	obj['key1'] = 'value1';
	obj['key2'] = 'value2';
	return obj; // Should use object literal instead
}

/**
 * Test prefer single boolean return
 */
export function preferSingleBooleanReturn(x: number): boolean {
	// sonarjs/prefer-single-boolean-return
	if (x > 10) {
		return true;
	} else {
		return false;
	}
}

/**
 * Test redundant boolean
 */
export function redundantBoolean(condition: boolean): boolean {
	// sonarjs/no-redundant-boolean
	return condition === true ? true : false;
}

/**
 * Test unused collection
 */
export function unusedCollection(): void {
	// sonarjs/no-unused-collection
	const unusedArray = [1, 2, 3, 4, 5];
	const unusedSet = new Set(['a', 'b', 'c']);
	
	// Collections are created but never used
}

/**
 * Test useless catch
 */
export function uselessCatch(): void {
	try {
		throw new Error('test error');
	} catch (error) {
		// sonarjs/no-useless-catch
		throw error; // Useless catch that just re-throws
	}
}

/**
 * Test prefer while
 */
export function preferWhile(): void {
	// sonarjs/prefer-while
	for (;;) {
		if (Math.random() > 0.5) {
			break;
		}
	}
}

/**
 * Test too many switch cases
 */
export function tooManySwitchCases(value: number): string {
	// sonarjs/max-switch-cases - This switch has too many cases
	switch (value) {
		case 1: return 'one';
		case 2: return 'two';
		case 3: return 'three';
		case 4: return 'four';
		case 5: return 'five';
		case 6: return 'six';
		case 7: return 'seven';
		case 8: return 'eight';
		case 9: return 'nine';
		case 10: return 'ten';
		case 11: return 'eleven';
		case 12: return 'twelve';
		case 13: return 'thirteen';
		case 14: return 'fourteen';
		case 15: return 'fifteen';
		case 16: return 'sixteen';
		case 17: return 'seventeen';
		case 18: return 'eighteen';
		case 19: return 'nineteen';
		case 20: return 'twenty';
		case 21: return 'twenty-one';
		case 22: return 'twenty-two';
		case 23: return 'twenty-three';
		case 24: return 'twenty-four';
		case 25: return 'twenty-five';
		case 26: return 'twenty-six';
		case 27: return 'twenty-seven';
		case 28: return 'twenty-eight';
		case 29: return 'twenty-nine';
		case 30: return 'thirty';
		case 31: return 'thirty-one';
		case 32: return 'thirty-two';
		default: return 'unknown';
	}
}

/**
 * Test nested switch
 */
export function nestedSwitch(x: number, y: number): string {
	switch (x) {
		case 1:
			// sonarjs/no-nested-switch
			switch (y) {
				case 1: return 'one-one';
				case 2: return 'one-two';
				default: return 'one-other';
			}
		case 2:
			return 'two';
		default:
			return 'other';
	}
}

/**
 * Test nested template literals
 */
export function nestedTemplateLiterals(name: string, age: number): string {
	// sonarjs/no-nested-template-literals
	return `Hello ${`${name} (${`age: ${age}`})`}`;
}

/**
 * Test redundant jump
 */
export function redundantJump(condition: boolean): void {
	if (condition) {
		console.log('condition is true');
		return; // sonarjs/no-redundant-jump - redundant return
	} else {
		console.log('condition is false');
	}
}

/**
 * Test same line conditional
 */
export function sameLineConditional(x: number): void {
	// sonarjs/no-same-line-conditional
	if (x > 0) console.log('positive'); else console.log('non-positive');
}