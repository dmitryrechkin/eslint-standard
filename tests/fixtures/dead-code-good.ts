/* eslint-env node */
/* global console, setTimeout, fetch */
/* eslint-disable @typescript-eslint/class-methods-use-this */
/**
 * Test fixture file containing code that should PASS all dead code cleanup rules
 * This file demonstrates best practices and should trigger NO violations
 */

// === Proper variable declarations (no-var) ===
const constantValue = 'immutable value';
let mutableValue = 'can be changed';
mutableValue = 'new value';
console.log(constantValue, mutableValue);

// === Proper initialization (no-undef-init) ===
let properlyInitialized: string | undefined;
const withDefault = 'default value';
const nullValue = null;
console.log(properlyInitialized, withDefault, nullValue);

// === Proper conditions (no-constant-condition) ===
const userCondition = getUserCondition();
if (userCondition) {
	console.log('Condition is dynamic');
}

function getUserCondition(): boolean {
	return Math.random() > 0.5;
}

// Infinite loop with clear intent (acceptable)
function processQueue(): void {
	while (true) {
		const item = getNextItem();
		if (!item) break;
		processItem(item);
	}
}

function getNextItem(): Item | null {
	return null; // Would return actual items in real code
}

function processItem(item: Item): void {
	console.log('Processing:', item.id);
}

interface Item {
	id: number;
}

// Call processQueue to mark it as used
processQueue();

// === No unreachable code ===
function properReturn(value: string): string {
	if (!value) {
		throw new Error('Value is required');
	}
	return value.toUpperCase();
}

function conditionalReturn(condition: boolean): string {
	if (condition) {
		return 'yes';
	}
	return 'no'; // No else - proper pattern
}

// Use the functions
console.log(properReturn('test'));
console.log(conditionalReturn(true));

// === Proper assignment without return ===
function properAssignment(): string {
	const result = 'assigned value';
	return result; // Separate assignment and return
}
console.log(properAssignment());

// === All variables are used ===
const usedConstant = 'I am used';
console.log(usedConstant);

let usedVariable = 'will be used later';
setTimeout(() => {
	console.log(usedVariable);
}, 100);

// All parameters are used
function allParametersUsed(param1: string, param2: number): string {
	return `${param1}: ${param2}`;
}
console.log(allParametersUsed('test', 42));

// Proper destructuring with all items used
const { used: renamed, another } = { used: 'value', another: 'value2' };
console.log(renamed, another);

// Array destructuring with all items used
const [first, second] = ['first', 'second'];
console.log(first, second);

// === All private class members are used ===
class ProperClassMembers {
	private privateProperty = 'used privately';
	private readonly config = { timeout: 5000 };

	private privateMethod(): string {
		return this.privateProperty;
	}

	public publicMethod(): string {
		return this.privateMethod();
	}

	public getConfig(): { timeout: number } {
		return this.config;
	}
}

// === Proper constructors ===
class ProperConstructor {
	private property: string;
	private readonly config: object;

	constructor(property: string, config: object) {
		this.property = property;
		this.config = config;
	}

	public getProperty(): string {
		return this.property;
	}

	public getConstructorConfig(): object {
		return this.config;
	}
}

// Simplified constructor with property parameters
// Note: TypeScript constructor parameter shorthand - properties ARE used via getters
class SimplifiedConstructor {
	/* eslint-disable no-unused-vars */
	constructor(
		private property: string,
		private readonly config: object
	) {}
	/* eslint-enable no-unused-vars */

	public getProperty(): string {
		return this.property;
	}

	public getSimplifiedConfig(): object {
		return this.config;
	}
}

// === Proper non-empty functions ===
class NonEmptyMethods {
	// Method with implementation
	process(data: string): void {
		console.log('Processing:', data);
	}

	// Static method with implementation
	static createInstance(): NonEmptyMethods {
		return new NonEmptyMethods();
	}

	// Private method with implementation
	private validateInput(input: string): boolean {
		return input.length > 0;
	}

	public validate(input: string): boolean {
		return this.validateInput(input);
	}
}

// === Proper use of 'this' ===
class ProperThisUsage {
	private value = 'test';

	validThisUsage(): string {
		return this.value; // Proper use of this
	}

	useThisInCallback(): void {
		setTimeout(() => {
			console.log(this.value); // Valid - this needed in closure
		}, 100);
	}

	arrowMethod = (): string => {
		return this.value; // Valid - arrow function binds this
	};

	// Static method doesn't use this
	static staticMethod(): string {
		return 'static value';
	}
}

// === Proper class usage ===
const properClassInstance = new ProperClassMembers();
console.log(properClassInstance.publicMethod());
console.log(properClassInstance.getConfig());

const properConstructorInstance = new ProperConstructor('value', {});
console.log(properConstructorInstance.getProperty());
console.log(properConstructorInstance.getConstructorConfig());

const simplifiedInstance = new SimplifiedConstructor('value', {});
console.log(simplifiedInstance.getProperty());
console.log(simplifiedInstance.getSimplifiedConfig());

const nonEmptyInstance = NonEmptyMethods.createInstance();
nonEmptyInstance.process('test');
console.log(nonEmptyInstance.validate('test'));

const thisUsageInstance = new ProperThisUsage();
console.log(thisUsageInstance.validThisUsage());
thisUsageInstance.useThisInCallback();
console.log(thisUsageInstance.arrowMethod());
console.log(ProperThisUsage.staticMethod());

// === Proper enum usage ===
// Note: Enum values ARE used in switch statement below
/* eslint-disable no-unused-vars */
enum StatusEnum {
	Pending = 'pending',
	Completed = 'completed',
	Failed = 'failed'
}
/* eslint-enable no-unused-vars */

function processStatus(status: StatusEnum): void {
	switch (status) {
		case StatusEnum.Pending:
			console.log('Processing...');
			break;
		case StatusEnum.Completed:
			console.log('Done!');
			break;
		case StatusEnum.Failed:
			console.log('Error occurred');
			break;
	}
}

processStatus(StatusEnum.Pending);

// === Proper type usage ===
type UserType = {
	id: number;
	name: string;
	email?: string;
};

function processUser(user: UserType): void {
	console.log(`User ${user.name} (${user.id})`);
}

const user: UserType = {
	id: 1,
	name: 'John Doe',
	email: 'john@example.com'
};
processUser(user);

// === Complex destructuring with all items used ===
function complexDestructuring(): void {
	const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
	const { a, b, ...rest } = obj;
	const { c: cRenamed, d: dUsed } = rest;
	console.log(a, b, cRenamed, dUsed);
}

complexDestructuring();

// === Proper object methods ===
const properObject = {
	value: 'test',
	getValue() {
		// If 'this' is needed, it's proper
		return this.value;
	},
	// Or as arrow function if this isn't needed
	getStatic: () => {
		return 'static value';
	}
};
console.log(properObject.getValue());
console.log(properObject.getStatic());

// === Proper use of parameters ===
function properParameters(required: string, optional?: string): string {
	if (optional) {
		return `${required}: ${optional}`;
	}
	return required;
}
console.log(properParameters('test'));
console.log(properParameters('test', 'optional'));

// Default parameter with usage
function defaultParameter(name: string = 'default'): string {
	return `Hello, ${name}!`;
}
console.log(defaultParameter());
console.log(defaultParameter('World'));

// === Proper variable declarations with patterns ===
// Destructuring with rest
const [primary, ...others] = ['first', 'second', 'third'];
console.log(primary, others.length);

// Renaming in destructuring
const { id: userId, name: userName } = { id: 1, name: 'John' };
console.log(userId, userName);

// === Exported values are used (in other files) ===
export const API_BASE_URL = 'https://api.example.com';
export const DEFAULT_TIMEOUT = 5000;

// Exported functions
export function formatName(firstName: string, lastName: string): string {
	return `${firstName} ${lastName}`;
}

// Exported types
export interface ApiResponse<T> {
	data: T;
	success: boolean;
	message?: string;
}

// === Proper async/await usage ===
async function fetchUserData(id: number): Promise<UserType> {
	const response = await fetch(`/api/users/${id}`);
	if (!response.ok) {
		throw new Error('Failed to fetch user');
	}
	return response.json();
}

// === Proper error handling ===
async function main(): Promise<void> {
	try {
		const fetchedUser = await fetchUserData(1);
		processUser(fetchedUser);
	} catch (error) {
		console.error('Error:', error);
	}
}
main();

// === Proper control flow ===
function validateEmail(email: string): boolean {
	if (!email) {
		return false;
	}
	if (!email.includes('@')) {
		return false;
	}
	if (email.length < 5) {
		return false;
	}
	return true;
}
console.log(validateEmail('test@example.com'));

// === Proper use of getters/setters ===
class UserProfile {
	private _email: string = '';

	get email(): string {
		return this._email;
	}

	set email(value: string) {
		if (validateEmail(value)) {
			this._email = value;
		} else {
			throw new Error('Invalid email format');
		}
	}
}

const profile = new UserProfile();
profile.email = 'test@example.com';
console.log(profile.email);

// === Proper class inheritance ===
abstract class Shape {
	abstract getArea(): number;

	toString(): string {
		return `Shape with area: ${this.getArea()}`;
	}
}

class Circle extends Shape {
	/* eslint-disable no-unused-vars */
	constructor(private radius: number) {
		super();
	}
	/* eslint-enable no-unused-vars */

	getArea(): number {
		return Math.PI * this.radius ** 2;
	}
}

const circle = new Circle(5);
console.log(`Circle area: ${circle.getArea()}`);
console.log(circle.toString());
