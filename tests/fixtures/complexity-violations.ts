// This file contains code that violates complexity rules for testing

// 1. High cyclomatic complexity (>10)
export function highComplexityFunction(value: number): string {
	if (value < 0) {
		if (value < -100) {
			return 'very negative';
		} else if (value < -50) {
			return 'negative';
		} else {
			return 'slightly negative';
		}
	} else if (value === 0) {
		return 'zero';
	} else if (value > 0) {
		if (value < 10) {
			return 'small';
		} else if (value < 50) {
			if (value % 2 === 0) {
				return 'medium even';
			} else {
				return 'medium odd';
			}
		} else if (value < 100) {
			if (value % 10 === 0) {
				return 'large round';
			} else {
				return 'large';
			}
		} else {
			return 'very large';
		}
	}
	return 'unknown';
}

// 2. Function too long (>100 lines)
export function veryLongFunction(): void {
	console.log('Line 1');
	console.log('Line 2');
	console.log('Line 3');
	console.log('Line 4');
	console.log('Line 5');
	console.log('Line 6');
	console.log('Line 7');
	console.log('Line 8');
	console.log('Line 9');
	console.log('Line 10');
	console.log('Line 11');
	console.log('Line 12');
	console.log('Line 13');
	console.log('Line 14');
	console.log('Line 15');
	console.log('Line 16');
	console.log('Line 17');
	console.log('Line 18');
	console.log('Line 19');
	console.log('Line 20');
	console.log('Line 21');
	console.log('Line 22');
	console.log('Line 23');
	console.log('Line 24');
	console.log('Line 25');
	console.log('Line 26');
	console.log('Line 27');
	console.log('Line 28');
	console.log('Line 29');
	console.log('Line 30');
	console.log('Line 31');
	console.log('Line 32');
	console.log('Line 33');
	console.log('Line 34');
	console.log('Line 35');
	console.log('Line 36');
	console.log('Line 37');
	console.log('Line 38');
	console.log('Line 39');
	console.log('Line 40');
	console.log('Line 41');
	console.log('Line 42');
	console.log('Line 43');
	console.log('Line 44');
	console.log('Line 45');
	console.log('Line 46');
	console.log('Line 47');
	console.log('Line 48');
	console.log('Line 49');
	console.log('Line 50');
	console.log('Line 51');
	console.log('Line 52');
	console.log('Line 53');
	console.log('Line 54');
	console.log('Line 55');
	console.log('Line 56');
	console.log('Line 57');
	console.log('Line 58');
	console.log('Line 59');
	console.log('Line 60');
	console.log('Line 61');
	console.log('Line 62');
	console.log('Line 63');
	console.log('Line 64');
	console.log('Line 65');
	console.log('Line 66');
	console.log('Line 67');
	console.log('Line 68');
	console.log('Line 69');
	console.log('Line 70');
	console.log('Line 71');
	console.log('Line 72');
	console.log('Line 73');
	console.log('Line 74');
	console.log('Line 75');
	console.log('Line 76');
	console.log('Line 77');
	console.log('Line 78');
	console.log('Line 79');
	console.log('Line 80');
	console.log('Line 81');
	console.log('Line 82');
	console.log('Line 83');
	console.log('Line 84');
	console.log('Line 85');
	console.log('Line 86');
	console.log('Line 87');
	console.log('Line 88');
	console.log('Line 89');
	console.log('Line 90');
	console.log('Line 91');
	console.log('Line 92');
	console.log('Line 93');
	console.log('Line 94');
	console.log('Line 95');
	console.log('Line 96');
	console.log('Line 97');
	console.log('Line 98');
	console.log('Line 99');
	console.log('Line 100');
	console.log('Line 101'); // This makes it too long
}

// 3. Too many statements (>20)
export function tooManyStatements(): void {
	const a = 1;
	const b = 2;
	const c = 3;
	const d = 4;
	const e = 5;
	const f = 6;
	const g = 7;
	const h = 8;
	const i = 9;
	const j = 10;
	const k = 11;
	const l = 12;
	const m = 13;
	const n = 14;
	const o = 15;
	const p = 16;
	const q = 17;
	const r = 18;
	const s = 19;
	const t = 20;
	const u = 21; // This exceeds the limit
	console.log(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u);
}

// 4. Too many parameters (>4)
export function tooManyParams(
	param1: string,
	param2: number,
	param3: boolean,
	param4: object,
	param5: string[] // This exceeds the limit
): void {
	console.log(param1, param2, param3, param4, param5);
}

// 5. Too deeply nested (>3 levels)
export function deeplyNested(data: any): void {
	if (data) {
		if (data.level1) {
			if (data.level1.level2) {
				if (data.level1.level2.level3) {
					// This is too deep (4 levels)
					console.log('Too deep!');
				}
			}
		}
	}
}

// 6. Nested callbacks (>3 levels)
export function nestedCallbacks(): void {
	setTimeout(() => {
		setTimeout(() => {
			setTimeout(() => {
				setTimeout(() => {
					// This is too deep
					console.log('Callback hell!');
				}, 100);
			}, 100);
		}, 100);
	}, 100);
}

// 7. Line too long (>120 characters)
export function lineTooLong(): void {
	const veryLongVariableNameThatExceedsTheMaximumLineLength = veryLongFunctionNameThatWillDefinitelyExceedTheLineLengthLimitWithoutUsingStringLiterals();
	console.log(veryLongVariableNameThatExceedsTheMaximumLineLength);
}

// 8. Magic numbers
export function magicNumbers(): void {
	const price = 19.99; // Magic number
	const discount = price * 0.15; // Magic number
	const timeout = 3000; // Magic number (not in allowed list)
	const retries = 5; // Magic number (not in allowed list)
	console.log(price, discount, timeout, retries);
}

// 9. Using any type
export function usingAny(data: any): any {
	return data.someProperty;
}

// 10. Parameter reassignment
export function paramReassign(value: number): number {
	value = value + 1; // Reassigning parameter
	return value;
}

// 11. No else after return
export function elseAfterReturn(value: number): string {
	if (value > 0) {
		return 'positive';
	} else { // else after return
		return 'non-positive';
	}
}

// 12. Nested ternary
export function nestedTernary(a: number, b: number): string {
	return a > 0 ? (b > 0 ? 'both positive' : 'a positive') : 'a not positive';
}

// Helper function for line length test
function veryLongFunctionNameThatWillDefinitelyExceedTheLineLengthLimitWithoutUsingStringLiterals(): string {
	return 'test';
}