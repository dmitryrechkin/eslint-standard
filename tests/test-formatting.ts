// Test file with various formatting issues that should be auto-fixed
import type { BaseConfig } from '../config';
import { EnumErrorCode } from '../enums';
import { TypeResponse } from '../types';
import type { SomeInterface } from './interfaces';

/**
 * Test class with misaligned JSDoc comments and wrong member ordering
 * @class TestClass
 * @param config - Configuration object
 * @returns Instance of TestClass
 */
export class TestClass implements SomeInterface
{
	// Wrong order: static field should be before instance fields
	public static readonly VERSION = '1.0.0';

	public readonly name: string;

	// Wrong order: private field should be after public
	private initialized = false;

	// Wrong order: constructor should come after fields
	constructor(name: string)
	{
		this.name = name;
	}

	/**
	 * Static method with misaligned JSDoc
	 * @returns Version string
	 */
	public static getVersion(): string
	{
		return TestClass.VERSION;
	}

	/**
	 * Public method with misaligned JSDoc
	 * @param config - The configuration
	 * @returns Promise with response
	 */
	public async initialize(config: BaseConfig): Promise<TypeResponse<void>>
	{
		if (!this.validateConfig(config))
		{
			return {
				success: false,
				messages: [{
					message: 'Invalid configuration',
					type: 'error',
					code: EnumErrorCode.INVALID_CONFIG
				}]
			};
		}

		this.initialized = true;
		return { success: true };
	}

	// Wrong order: getter should come before methods
	public get isInitialized(): boolean
	{
		return this.initialized;
	}

	/**
	 * Another public method with wrong JSDoc indentation
	 * @param value - Input value
	 * @returns Processed value
	 */
	public processValue(value: string): string
	{
		return value.trim().toLowerCase();
	}

	// Wrong order: protected method between public methods
	protected performCleanup(): void
	{
		this.initialized = false;
	}

	// Wrong order: private method before public
	private validateConfig(config: BaseConfig): boolean
	{
		return !!config;
	}
}

/**
 * Interface with misaligned JSDoc
 * @interface TestInterface
 */
export interface TestInterface
{
	readonly id: string;
	name: string;

	/**
	 * Method with wrong JSDoc alignment
	 * @param data - Input data
	 * @returns Processed result
	 */
	process(data: unknown): Promise<TypeResponse<string>>;
}

/**
 * Enum with proper JSDoc (should stay unchanged)
 */
export enum TestEnum
{
	FIRST = 'first',
	SECOND = 'second',
	THIRD = 'third'
}

/**
 * Function with misaligned JSDoc
 * @param input - The input string
 * @param options - Processing options
 * @returns Formatted output
 */
export function formatString(input: string, options?: { uppercase?: boolean }): string
{
	let result = input.trim();

	if (options?.uppercase)
	{
		result = result.toUpperCase();
	}

	return result;
}
