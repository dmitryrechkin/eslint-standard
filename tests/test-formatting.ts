// Test file with various formatting issues that should be auto-fixed
import type { BaseConfig } from '../config';
import { EnumErrorCode } from '../enums';
import { TypeResponse } from '../types';
import type { SomeInterface } from './interfaces';

// Missing JSDoc - should be added
export interface TypeFreshdeskProviderSpecific
{
	/** Freshdesk API key for authentication */
	apiKey: string;

	/** Freshdesk domain (subdomain only, without .freshdesk.com) */
	domain: string;

	/** Optional webhook secret for validating incoming webhooks */
	webhookSecret?: string;

	/** Optional custom headers to send with requests */
	headers?: Record<string, string>;
}


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

	// Getter placed among methods (correct placement)
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

	// Wrong order: protected method between public methods - Missing JSDoc
	protected performCleanup(): void
	{
		this.initialized = false;
	}

	// Wrong order: private method before public - Missing JSDoc
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
 * @param options.uppercase
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

// Missing JSDoc for arrow function - should be added
export const processData = (data: string[]): string[] =>
{
	return data.map(item => item.trim()).filter(Boolean);
};

// Missing JSDoc for type alias - should be added
export type ConfigOptions =
{
	debug: boolean;
	timeout: number;
};

// Missing JSDoc for another enum - should be added
export enum StatusCode {
	SUCCESS = 200,
	NOT_FOUND = 404,
	ERROR = 500
}
