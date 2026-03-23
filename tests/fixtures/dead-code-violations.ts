/**
 * Test fixture file containing various dead code violations
 * This file should trigger ALL the new dead code cleanup rules
 */

// === no-var violations ===
var oldStyleVariable = 'should be const or let';
var unusedVar = 'never used';

// === no-undef-init violations ===
let undefinedVar = undefined;
const alsoUndefined = undefined;

// === no-constant-condition violations ===
while (true) { // This might be intentional, but let's include it
	break;
}

if (false) { // Dead code
	console.log('This will never run');
}

const condition = true;
if (condition) {
	// This is fine
} else {
	// Dead code
	console.log('Never reached');
}

// === no-unreachable violations ===
function unreachableExample() {
	return;
	console.log('This is unreachable'); // Should trigger no-unreachable

	throw new Error('Also unreachable');
}

// === no-else-return violations ===
function elseReturnExample(condition: boolean) {
	if (condition) {
		return 'yes';
	} else {
		return 'no'; // Should trigger no-else-return
	}
}

function elseReturnExample2(condition: boolean) {
	if (condition) {
		return 'yes';
	} else if (condition === false) {
		return 'maybe';
	} else {
		return 'no'; // Should trigger no-else-return
	}
}

// === no-return-assign violations ===
function returnAssignExample() {
	return (result = 'assignment'); // Should trigger no-return-assign
}

let result = '';
function returnAssignExample2() {
	return result = 'another assignment'; // Should trigger no-return-assign
}

// === @typescript-eslint/no-unused-vars violations ===
const usedVariable = 'I am used';
console.log(usedVariable);

const unusedConstant = 'never used'; // Should trigger no-unused-vars
let unusedLetVariable = 'also never used'; // Should trigger no-unused-vars
function unusedParameter(param: string, unusedParam: number) { // unusedParam should trigger
	return param;
}

// Destructuring with unused
const { used, unused } = { used: 'value', unused: 'ignored' }; // unused should trigger

// Array destructuring with unused
const [firstUnused, secondUnused] = ['a', 'b']; // Both should trigger

// === @typescript-eslint/no-unused-private-class-members violations ===
class UnusedMembers {
	private unusedProperty = 'never used'; // Should trigger
	private unusedMethod() { // Should trigger
		return 'unused';
	}

	private usedProperty = 'used';
	private usedMethod() {
		return this.usedProperty;
	}

	public useMembers() {
		return this.usedMethod();
	}
}

// === @typescript-eslint/no-useless-constructor violations ===
class UselessConstructor {
	constructor() {} // Should trigger - empty constructor

	constructor(private name: string) {} // This is actually useful
}

class AnotherUseless {
	private prop: string;
	constructor() {
		// Only initializing props - can be simplified
		this.prop = 'value';
	}
}

// === @typescript-eslint/no-empty-function violations ===
class EmptyFunctions {
	emptyMethod() {} // Should trigger - empty method

	static emptyStaticMethod() {} // Should trigger

	private emptyPrivateMethod() {} // Should trigger
}

// Useful empty functions (should be allowed with proper justification)
const usefulEmptyFunction = () => {
	// Empty by design - will be implemented later
	// TODO: implement
};

// === @typescript-eslint/no-empty-interface violations ===
interface EmptyInterface { // Should trigger

}

interface EmptyWithExtends extends SomeOtherInterface { // Should trigger

}

// === @typescript-eslint/no-useless-this violations ===
class UselessThis {
	private value = 'test';

	uselessThisMethod() {
		return this.value; // Should trigger - doesn't need this
	}

	anotherUselessMethod() {
		const self = this;
		return self.value; // Should trigger
	}

	validUseOfThis() {
		setTimeout(() => {
			console.log(this.value); // Valid - this is needed in closure
		}, 100);
	}
}

// Additional complex cases

// Unused class
class UnusedClass {
	constructor() {
		console.log('never instantiated');
	}
}

// Unused enum
enum UnusedEnum {
	Value1,
	Value2
}

// Unused type alias
type UnusedType = {
	name: string;
	value: number;
};

// Unused in module scope
const moduleLevelUnused = 'value';

// Exported but never imported (still considered unused in some contexts)
export const exportedButUnused = 'exported value';

// Complex destructuring cases
function complexDestructuring() {
	const obj = { a: 1, b: 2, c: 3, d: 4 };
	const { a, b, ...rest } = obj;
	const { c: unusedRename, d: used } = rest;
	return { a, b, used };
}

// Import violations (would need actual imports to test)
// import { unusedImport } from 'some-module'; // Would trigger

// Type-only imports that are unused
// import type { UnusedType } from 'types'; // Would trigger

// Reassignments that could trigger return-assign
function assignmentReturn() {
	let x = 1;
	return x = 2; // Should trigger
}

// Variable declared but never read
let declaredOnly;
declaredOnly = 'value'; // Assigned but never read

// Parameters with underscore prefix (common pattern to indicate unused)
function underscorePattern(_unused: string, used: string) {
	return used;
}

// Object methods that don't use this
const objectWithUselessThis = {
	value: 'test',
	getValue() {
		return 'static'; // Should trigger - doesn't need this
	},
	getThisValue() {
		return this.value; // Valid use of this
	}
};

// Arrow functions in class context
class ArrowFunctionContext {
	private value = 'test';

	getValue = () => {
		return this.value; // Valid - arrow function needs this
	};

	getStatic = () => {
		return 'static'; // Should trigger - doesn't need this
	};
}

// Default parameters that are never used
function defaultParameters(unused: string = 'default') {
	return 'result';
}

// Optional parameters that are never used
function optionalParameters(used: string, unused?: string) {
	return used;
}