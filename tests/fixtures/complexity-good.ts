// This file contains code that follows all complexity rules

/**
 * Helper function for loading configuration
 * @returns {object} Configuration object
 */
function loadConfig(): { setting: string }
{
	return { setting: 'default' };
}

/**
 * Helper function for processing data
 * @param {object} config - Configuration object
 * @param {string} config.setting - Configuration setting
 * @returns {string} Processed result
 */
function processData(config: { setting: string }): string
{
	return `processed: ${config.setting}`;
}

/**
 * Helper function for displaying results
 * @param {string} result - Result to display
 * @returns {void}
 */
function displayResult(result: string): void
{
	console.error(result);
}

/**
 * Function with low cyclomatic complexity
 * @param {number} value - The value to categorize
 * @returns {string} The category
 */
export function lowComplexityFunction(value: number): string
{
	if (value < 0)
	{
		return 'negative';
	}
	if (value === 0)
	{
		return 'zero';
	}
	const smallThreshold = 50;
	if (value < smallThreshold)
	{
		return 'small';
	}
	const mediumThreshold = 100;
	if (value < mediumThreshold)
	{
		return 'medium';
	}
	return 'large';
}

/**
 * Function with appropriate length
 * @returns {void}
 */
export function appropriateLengthFunction(): void
{
	// Initialize
	const config = loadConfig();

	// Process
	const result = processData(config);

	// Output
	displayResult(result);
}

/**
 * Function with reasonable statement count
 * @returns {void}
 */
export function reasonableStatements(): void
{
	const items: number[] = [];

	const maxItems = 10;
	for (let i = 0; i < maxItems; i++)
	{
		items.push(i);
	}

	console.error(items);
}

/**
 * Function with good parameter count
 * @param {string} name - The name
 * @param {number} age - The age
 * @param {boolean} active - Whether active
 * @returns {object} The user object
 */
export function goodParamCount(name: string, age: number, active: boolean): object
{
	return { name, age, active };
}

/**
 * Function with proper nesting (max 2 levels)
 * @param {object} data - The data to validate
 * @param {string} [data.value] - Optional value property
 * @returns {boolean} Whether valid
 */
export function properNesting(data: { value?: string }): boolean
{
	if (data.value)
	{
		return Boolean(data.value);
	}
	return false;
}

/**
 * Function with proper callback usage
 * @returns {void}
 */
export function goodCallbacks(): void
{
	setTimeout(() =>
	{
		setTimeout(() =>
		{
			console.error('Two levels only');
		}, 100);
	}, 100);
}

/**
 * Function with constants instead of magic numbers
 * @returns {void}
 */
export function namedConstants(): void
{
	const defaultPrice = 19.99;
	const discountRate = 0.15;
	const apiTimeout = 3000;
	const maxRetries = 5;

	const price = defaultPrice;
	const discount = price * discountRate;
	const timeout = apiTimeout;
	const retries = maxRetries;
	console.error(price, discount, timeout, retries);
}

/**
 * Function using proper types
 * @param {object} data - Typed data object
 * @param {string} data.someProperty - Some property value
 * @returns {string} Processed data
 */
export function properTypes(data: { someProperty: string }): string
{
	return data.someProperty;
}

/**
 * Function without parameter reassignment
 * @param {number} value - The input value
 * @returns {number} Modified value
 */
export function noParamReassign(value: number): number
{
	const modifiedValue = value + 1;
	return modifiedValue;
}

/**
 * Function without else after return
 * @param {number} value - The input value
 * @returns {string} Status string
 */
export function noElseAfterReturn(value: number): string
{
	if (value > 0)
	{
		return 'positive';
	}
	return 'non-positive';
}

/**
 * Function without nested ternary
 * @param {number} firstValue - First value
 * @param {number} secondValue - Second value
 * @returns {string} Description string
 */
export function noNestedTernary(firstValue: number, secondValue: number): string
{
	if (firstValue > 0)
	{
		return secondValue > 0 ? 'both positive' : 'first positive';
	}
	return 'first not positive';
}
